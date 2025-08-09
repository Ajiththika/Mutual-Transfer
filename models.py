from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class FundHouse(models.Model):
    """Model for mutual fund houses."""
    
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=10, unique=True)
    website = models.URLField(blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Fund House')
        verbose_name_plural = _('Fund Houses')
        db_table = 'fund_houses'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class FundScheme(models.Model):
    """Model for mutual fund schemes."""
    
    FUND_TYPES = [
        ('equity', 'Equity'),
        ('debt', 'Debt'),
        ('hybrid', 'Hybrid'),
        ('liquid', 'Liquid'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    fund_house = models.ForeignKey(FundHouse, on_delete=models.CASCADE, related_name='schemes')
    fund_type = models.CharField(max_length=20, choices=FUND_TYPES)
    nav = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    nav_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Fund Scheme')
        verbose_name_plural = _('Fund Schemes')
        db_table = 'fund_schemes'
        ordering = ['fund_house', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.fund_house.name})"


class Transfer(models.Model):
    """Model for mutual fund transfers."""
    
    TRANSFER_TYPES = [
        ('in', 'Transfer In'),
        ('out', 'Transfer Out'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transfers')
    transfer_type = models.CharField(max_length=3, choices=TRANSFER_TYPES)
    source_scheme = models.ForeignKey(FundScheme, on_delete=models.CASCADE, related_name='source_transfers')
    target_scheme = models.ForeignKey(FundScheme, on_delete=models.CASCADE, related_name='target_transfers', blank=True, null=True)
    
    # Transfer details
    units = models.DecimalField(max_digits=15, decimal_places=4)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    nav_at_transfer = models.DecimalField(max_digits=10, decimal_places=4)
    
    # Status and tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    
    # Timestamps
    transfer_date = models.DateField()
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    # Additional information
    notes = models.TextField(blank=True, null=True)
    documents = models.FileField(upload_to='transfer_documents/', blank=True, null=True)
    
    class Meta:
        verbose_name = _('Transfer')
        verbose_name_plural = _('Transfers')
        db_table = 'transfers'
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.get_transfer_type_display()} - {self.reference_number}"
    
    def save(self, *args, **kwargs):
        if not self.reference_number:
            self.reference_number = self.generate_reference_number()
        super().save(*args, **kwargs)
    
    def generate_reference_number(self):
        """Generate a unique reference number for the transfer."""
        import uuid
        return f"TRF-{uuid.uuid4().hex[:8].upper()}"
    
    @property
    def is_completed(self):
        """Check if the transfer is completed."""
        return self.status == 'completed'
    
    @property
    def is_pending(self):
        """Check if the transfer is pending."""
        return self.status == 'pending'
