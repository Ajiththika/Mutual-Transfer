from django.contrib import admin
from .models import FundHouse, FundScheme, Transfer


@admin.register(FundHouse)
class FundHouseAdmin(admin.ModelAdmin):
    """Admin configuration for FundHouse model."""
    
    list_display = ('name', 'code', 'website', 'contact_number', 'email', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'code', 'email')
    ordering = ('name',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('name', 'code', 'is_active')
        }),
        ('Contact Information', {
            'fields': ('website', 'contact_number', 'email', 'address')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(FundScheme)
class FundSchemeAdmin(admin.ModelAdmin):
    """Admin configuration for FundScheme model."""
    
    list_display = ('name', 'code', 'fund_house', 'fund_type', 'nav', 'nav_date', 'is_active')
    list_filter = ('fund_type', 'is_active', 'fund_house', 'created_at')
    search_fields = ('name', 'code', 'fund_house__name')
    ordering = ('fund_house', 'name')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('name', 'code', 'fund_house', 'fund_type', 'is_active')
        }),
        ('NAV Information', {
            'fields': ('nav', 'nav_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Transfer)
class TransferAdmin(admin.ModelAdmin):
    """Admin configuration for Transfer model."""
    
    list_display = ('reference_number', 'user', 'transfer_type', 'source_scheme', 'target_scheme', 'units', 'amount', 'status', 'transfer_date')
    list_filter = ('transfer_type', 'status', 'transfer_date', 'requested_at')
    search_fields = ('reference_number', 'user__username', 'user__email', 'source_scheme__name', 'target_scheme__name')
    ordering = ('-requested_at',)
    readonly_fields = ('reference_number', 'requested_at', 'processed_at', 'completed_at')
    
    fieldsets = (
        (None, {
            'fields': ('reference_number', 'user', 'transfer_type', 'status')
        }),
        ('Transfer Details', {
            'fields': ('source_scheme', 'target_scheme', 'units', 'amount', 'nav_at_transfer', 'transfer_date')
        }),
        ('Additional Information', {
            'fields': ('notes', 'documents')
        }),
        ('Timestamps', {
            'fields': ('requested_at', 'processed_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'source_scheme', 'target_scheme')
