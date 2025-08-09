from rest_framework import serializers
from .models import FundHouse, FundScheme, Transfer


class FundHouseSerializer(serializers.ModelSerializer):
    """Serializer for FundHouse model."""
    
    class Meta:
        model = FundHouse
        fields = '__all__'


class FundSchemeSerializer(serializers.ModelSerializer):
    """Serializer for FundScheme model."""
    
    fund_house_name = serializers.CharField(source='fund_house.name', read_only=True)
    
    class Meta:
        model = FundScheme
        fields = '__all__'


class TransferSerializer(serializers.ModelSerializer):
    """Serializer for Transfer model."""
    
    user_username = serializers.CharField(source='user.username', read_only=True)
    source_scheme_name = serializers.CharField(source='source_scheme.name', read_only=True)
    target_scheme_name = serializers.CharField(source='target_scheme.name', read_only=True)
    transfer_type_display = serializers.CharField(source='get_transfer_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Transfer
        fields = '__all__'
        read_only_fields = ('reference_number', 'requested_at', 'processed_at', 'completed_at')
    
    def validate(self, attrs):
        """Validate transfer data."""
        if attrs['transfer_type'] == 'out' and not attrs.get('target_scheme'):
            raise serializers.ValidationError("Target scheme is required for transfer out.")
        
        if attrs['units'] <= 0:
            raise serializers.ValidationError("Units must be greater than zero.")
        
        if attrs['amount'] <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        
        return attrs


class TransferCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating transfers."""
    
    class Meta:
        model = Transfer
        fields = (
            'transfer_type', 'source_scheme', 'target_scheme', 'units', 
            'amount', 'nav_at_transfer', 'transfer_date', 'notes'
        )
    
    def validate(self, attrs):
        """Validate transfer creation data."""
        if attrs['transfer_type'] == 'out' and not attrs.get('target_scheme'):
            raise serializers.ValidationError("Target scheme is required for transfer out.")
        
        if attrs['units'] <= 0:
            raise serializers.ValidationError("Units must be greater than zero.")
        
        if attrs['amount'] <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        
        return attrs


class TransferUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating transfers."""
    
    class Meta:
        model = Transfer
        fields = ('status', 'notes', 'documents')
        read_only_fields = ('reference_number', 'user', 'transfer_type', 'source_scheme', 'target_scheme')
