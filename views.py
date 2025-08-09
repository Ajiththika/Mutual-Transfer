from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import FundHouse, FundScheme, Transfer
from .serializers import (
    FundHouseSerializer, FundSchemeSerializer, TransferSerializer,
    TransferCreateSerializer, TransferUpdateSerializer
)
from django.db import models


class FundHouseListView(generics.ListAPIView):
    """View for listing fund houses."""
    
    queryset = FundHouse.objects.filter(is_active=True)
    serializer_class = FundHouseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code']
    ordering = ['name']


class FundSchemeListView(generics.ListAPIView):
    """View for listing fund schemes."""
    
    queryset = FundScheme.objects.filter(is_active=True).select_related('fund_house')
    serializer_class = FundSchemeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['fund_type', 'fund_house']
    search_fields = ['name', 'code', 'fund_house__name']
    ordering_fields = ['name', 'nav', 'nav_date']
    ordering = ['fund_house__name', 'name']


class TransferListView(generics.ListCreateAPIView):
    """View for listing and creating transfers."""
    
    serializer_class = TransferSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['transfer_type', 'status', 'transfer_date']
    search_fields = ['reference_number', 'source_scheme__name', 'target_scheme__name']
    ordering_fields = ['requested_at', 'transfer_date', 'amount']
    ordering = ['-requested_at']
    
    def get_queryset(self):
        return Transfer.objects.filter(user=self.request.user).select_related(
            'source_scheme', 'target_scheme', 'source_scheme__fund_house'
        )
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TransferCreateSerializer
        return TransferSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransferDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting transfers."""
    
    serializer_class = TransferSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transfer.objects.filter(user=self.request.user).select_related(
            'source_scheme', 'target_scheme', 'source_scheme__fund_house'
        )
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return TransferUpdateSerializer
        return TransferSerializer
    
    def destroy(self, request, *args, **kwargs):
        transfer = self.get_object()
        if transfer.status in ['completed', 'processing']:
            return Response(
                {'error': 'Cannot delete completed or processing transfers.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transfer_stats(request):
    """Get transfer statistics for the user."""
    
    user_transfers = Transfer.objects.filter(user=request.user)
    
    stats = {
        'total_transfers': user_transfers.count(),
        'pending_transfers': user_transfers.filter(status='pending').count(),
        'completed_transfers': user_transfers.filter(status='completed').count(),
        'total_amount': float(user_transfers.aggregate(
            total=models.Sum('amount')
        )['total'] or 0),
        'transfers_by_type': {
            'in': user_transfers.filter(transfer_type='in').count(),
            'out': user_transfers.filter(transfer_type='out').count(),
        },
        'transfers_by_status': dict(
            user_transfers.values_list('status').annotate(
                count=models.Count('id')
            )
        )
    }
    
    return Response(stats)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_transfer_status_update(request):
    """Update status of multiple transfers."""
    
    transfer_ids = request.data.get('transfer_ids', [])
    new_status = request.data.get('status')
    
    if not transfer_ids or not new_status:
        return Response(
            {'error': 'transfer_ids and status are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if new_status not in dict(Transfer.STATUS_CHOICES):
        return Response(
            {'error': 'Invalid status.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    transfers = Transfer.objects.filter(
        id__in=transfer_ids,
        user=request.user
    )
    
    if not transfers.exists():
        return Response(
            {'error': 'No valid transfers found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    transfers.update(status=new_status)
    
    return Response({
        'message': f'Successfully updated {transfers.count()} transfers to {new_status}.'
    })
