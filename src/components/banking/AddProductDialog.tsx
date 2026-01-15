import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { useProductCatalog } from '@/hooks/useBankingProducts';
import { useAddProduct, useUpdateProduct } from '@/hooks/useBankingProducts';
import { Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
// mapProductType removed - not needed since catalog products are already transformed
import type { UserProduct, BankingProductType } from '@/lib/api/types/banking';
import { format } from 'date-fns';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editProduct?: UserProduct | null;
}

interface FormErrors {
  currentBalance?: string;
  outstandingBalance?: string;
  creditLimit?: string;
  loanAmount?: string;
  monthlyPayment?: string;
}

export const AddProductDialog = ({
  open,
  onOpenChange,
  editProduct,
}: AddProductDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedProductType, setSelectedProductType] = useState<BankingProductType | null>(null);
  
  // Form fields
  const [currentBalance, setCurrentBalance] = useState<string>('');
  const [outstandingBalance, setOutstandingBalance] = useState<string>('');
  const [creditLimit, setCreditLimit] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('');
  const [openedDate, setOpenedDate] = useState<Date | undefined>(undefined);
  
  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { data: catalogData } = useProductCatalog({ search: searchQuery });
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct(editProduct?.id || '');

  const filteredProducts = catalogData?.products || [];

  // Get selected product details
  const selectedProduct = useMemo(() => {
    if (editProduct) {
      return null; // In edit mode, we already have the product
    }
    return filteredProducts.find(p => p.productId === selectedProductId);
  }, [filteredProducts, selectedProductId, editProduct]);

  // Initialize form when product is selected or when editing
  useEffect(() => {
    if (editProduct) {
      // Edit mode: pre-fill all saved fields
      setSelectedProductType(editProduct.productType);
      setCurrentBalance(editProduct.currentBalance?.toString() || '');
      setOutstandingBalance(editProduct.outstandingBalance?.toString() || '');
      setCreditLimit(editProduct.creditLimit?.toString() || '');
      setLoanAmount(editProduct.loanAmount?.toString() || '');
      setMonthlyPayment(editProduct.monthlyPayment?.toString() || '');
      setOpenedDate(editProduct.openedDate ? new Date(editProduct.openedDate) : undefined);
    } else if (selectedProduct) {
      // Add mode: detect product type from selected product
      // selectedProduct.type is already in frontend format (already mapped by transformCatalogItem)
      // No need to call mapProductType again - it would cause incorrect defaulting to 'savings'
      
      // ADD VALIDATION: Ensure selectedProduct matches selectedProductId
      if (selectedProduct.productId !== selectedProductId) {
        console.error('[AddProduct] Mismatch detected:', {
          selectedProductId,
          selectedProductProductId: selectedProduct.productId,
          selectedProductName: selectedProduct.name,
          selectedProductType: selectedProduct.type,
        });
        // Reset to prevent wrong product type
        setSelectedProductType(null);
        return;
      }
      
      console.log('[AddProduct] Product selected:', {
        productId: selectedProduct.productId,
        name: selectedProduct.name,
        type: selectedProduct.type,
        bank: selectedProduct.bank,
      });
      
      setSelectedProductType(selectedProduct.type);
      // Reset form fields when product changes
      setCurrentBalance('');
      setOutstandingBalance('');
      setCreditLimit('');
      setLoanAmount('');
      setMonthlyPayment('');
      setOpenedDate(undefined);
      setErrors({});
      setTouched({});
    } else if (selectedProductId && !selectedProduct) {
      // Product ID selected but product not found - this shouldn't happen
      console.warn('[AddProduct] Product ID selected but product not found:', {
        selectedProductId,
        availableProducts: filteredProducts.map(p => ({
          id: p.id,
          productId: p.productId,
          name: p.name,
        })),
      });
      setSelectedProductType(null);
    }
  }, [selectedProduct, editProduct, selectedProductId, filteredProducts]);

  // Validate field on blur
  const validateField = (fieldName: string, value: string | number | undefined): string | undefined => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (!selectedProductType) return undefined;

    switch (fieldName) {
      case 'currentBalance':
        if (selectedProductType === 'savings' || selectedProductType === 'cd') {
          if (!value || value === '') {
            return 'Current Balance is required';
          }
          if (numValue < 0) {
            return 'Current Balance must be >= 0';
          }
        }
        break;
      
      case 'outstandingBalance':
        if (selectedProductType === 'credit_card' || selectedProductType === 'loan') {
          if (!value || value === '') {
            return 'Outstanding Balance is required';
          }
          if (numValue < 0) {
            return 'Outstanding Balance must be >= 0';
          }
          // Check against credit limit
          if (selectedProductType === 'credit_card' && creditLimit) {
            const limit = parseFloat(creditLimit);
            if (numValue > limit) {
              return 'Outstanding Balance cannot exceed Credit Limit';
            }
          }
          // Check against loan amount
          if (selectedProductType === 'loan' && loanAmount) {
            const loan = parseFloat(loanAmount);
            if (numValue > loan) {
              return 'Outstanding Balance cannot exceed Loan Amount';
            }
          }
        }
        break;
      
      case 'creditLimit':
        if (selectedProductType === 'credit_card' && creditLimit) {
          const limit = parseFloat(creditLimit);
          if (limit < 0) {
            return 'Credit Limit must be >= 0';
          }
          if (outstandingBalance) {
            const balance = parseFloat(outstandingBalance);
            if (balance > limit) {
              return 'Outstanding Balance cannot exceed Credit Limit';
            }
          }
        }
        break;
      
      case 'loanAmount':
        if (selectedProductType === 'loan') {
          if (!value || value === '') {
            return 'Loan Amount is required';
          }
          if (numValue <= 0) {
            return 'Loan Amount must be > 0';
          }
          if (outstandingBalance) {
            const balance = parseFloat(outstandingBalance);
            if (balance > numValue) {
              return 'Outstanding Balance cannot exceed Loan Amount';
            }
          }
        }
        break;
      
      case 'monthlyPayment':
        if (selectedProductType === 'loan' && monthlyPayment) {
          const payment = parseFloat(monthlyPayment);
          if (payment < 0) {
            return 'Monthly Payment must be >= 0';
          }
        }
        break;
    }
    
    return undefined;
  };

  // Validate all fields on submit
  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!selectedProductType) {
      return false;
    }

    // Validate based on product type
    if (selectedProductType === 'savings' || selectedProductType === 'cd') {
      const error = validateField('currentBalance', currentBalance);
      if (error) newErrors.currentBalance = error;
    }

    if (selectedProductType === 'credit_card') {
      const error = validateField('outstandingBalance', outstandingBalance);
      if (error) newErrors.outstandingBalance = error;
      
      if (creditLimit) {
        const limitError = validateField('creditLimit', creditLimit);
        if (limitError) newErrors.creditLimit = limitError;
      }
    }

    if (selectedProductType === 'loan') {
      const loanError = validateField('loanAmount', loanAmount);
      if (loanError) newErrors.loanAmount = loanError;
      
      const balanceError = validateField('outstandingBalance', outstandingBalance);
      if (balanceError) newErrors.outstandingBalance = balanceError;
      
      if (monthlyPayment) {
        const paymentError = validateField('monthlyPayment', monthlyPayment);
        if (paymentError) newErrors.monthlyPayment = paymentError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (fieldName: string, value: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleSubmit = () => {
    if (!selectedProductType) return;
    
    if (editProduct && !editProduct.productId) return;
    if (!editProduct && !selectedProductId) return;

    // Validate all fields
    if (!validateAll()) {
      return;
    }

    // Build request body with only relevant fields
    const productIdToSend = editProduct?.productId || selectedProductId;
    
    // ADD DEBUG LOGGING
    console.log('[AddProduct] Debug Info:', {
      selectedProductId,
      selectedProductType,
      selectedProduct: selectedProduct ? {
        id: selectedProduct.id,
        productId: selectedProduct.productId,
        name: selectedProduct.name,
        type: selectedProduct.type,
        bank: selectedProduct.bank,
      } : null,
      productIdToSend,
      allFilteredProducts: filteredProducts.map(p => ({
        id: p.id,
        productId: p.productId,
        name: p.name,
        type: p.type,
      })),
    });

    const productData: any = {
      productId: productIdToSend,
    };

    // Add fields based on product type
    if (selectedProductType === 'savings' || selectedProductType === 'cd') {
      productData.currentBalance = parseFloat(currentBalance) || 0;
    }

    if (selectedProductType === 'credit_card') {
      productData.outstandingBalance = parseFloat(outstandingBalance) || 0;
      if (creditLimit) {
        productData.creditLimit = parseFloat(creditLimit);
      }
    }

    if (selectedProductType === 'loan') {
      productData.loanAmount = parseFloat(loanAmount);
      productData.outstandingBalance = parseFloat(outstandingBalance) || 0;
      if (monthlyPayment) {
        productData.monthlyPayment = parseFloat(monthlyPayment);
      }
    }

    // Debit card has no balance fields

    // Dates are optional - removed to avoid backend validation issues
    // if (openedDate) {
    //   productData.openedDate = openedDate.toISOString().split('T')[0];
    // }

    console.log('[AddProduct] Final request body:', productData);

    if (editProduct) {
      updateProductMutation.mutate(productData, {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
        },
      });
    } else {
      addProductMutation.mutate(productData, {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
        },
      });
    }
  };

  const resetForm = () => {
    setSearchQuery('');
    setSelectedProductId('');
    setSelectedProductType(null);
    setCurrentBalance('');
    setOutstandingBalance('');
    setCreditLimit('');
    setLoanAmount('');
    setMonthlyPayment('');
    setOpenedDate(undefined);
    setErrors({});
    setTouched({});
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  // Determine which fields to show based on product type
  const showCurrentBalance = selectedProductType === 'savings' || selectedProductType === 'cd';
  const showOutstandingBalance = selectedProductType === 'credit_card' || selectedProductType === 'loan';
  const showCreditLimit = selectedProductType === 'credit_card';
  const showLoanAmount = selectedProductType === 'loan';
  const showMonthlyPayment = selectedProductType === 'loan';
  const showOpenedDate = false; // Disabled - backend has validation issues with dates

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogDescription>
            {editProduct
              ? 'Update your product details'
              : 'Search for and add a banking product to your profile'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!editProduct && (
            <>
              <div className="space-y-2">
                <Label>Search Products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a banking product..."
                    className="pl-10"
                  />
                </div>
              </div>

              {filteredProducts.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <Label>Select Product</Label>
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProductId(product.productId)}
                        className={`w-full text-left p-3 rounded-md border transition-colors ${
                          selectedProductId === product.productId
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.bank}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Show form fields when product is selected or editing */}
          {(selectedProductType || editProduct) && (
            <div className="space-y-4 pt-4 border-t">
              {/* Savings Account / Fixed Deposit Fields */}
              {showCurrentBalance && (
                <div className="space-y-2">
                  <Label htmlFor="currentBalance">
                    {selectedProductType === 'cd' ? 'Principal Amount (BND)' : 'Current Balance (BND)'}
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    id="currentBalance"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(e.target.value)}
                    onBlur={(e) => handleBlur('currentBalance', e.target.value)}
                    placeholder={selectedProductType === 'cd' 
                      ? "Enter the principal amount" 
                      : "Enter your current account balance"}
                    className={errors.currentBalance && touched.currentBalance ? 'border-destructive' : ''}
                  />
                  {errors.currentBalance && touched.currentBalance && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.currentBalance}
                    </p>
                  )}
                </div>
              )}

              {/* Credit Card Fields */}
              {showOutstandingBalance && selectedProductType === 'credit_card' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="outstandingBalance">
                      Outstanding Balance (BND)
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      id="outstandingBalance"
                      type="number"
                      min="0"
                      step="0.01"
                      value={outstandingBalance}
                      onChange={(e) => setOutstandingBalance(e.target.value)}
                      onBlur={(e) => handleBlur('outstandingBalance', e.target.value)}
                      placeholder="Enter your current credit card debt"
                      className={errors.outstandingBalance && touched.outstandingBalance ? 'border-destructive' : ''}
                    />
                    {errors.outstandingBalance && touched.outstandingBalance && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.outstandingBalance}
                      </p>
                    )}
                  </div>

                  {showCreditLimit && (
                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">Credit Limit (BND) (Optional)</Label>
                      <Input
                        id="creditLimit"
                        type="number"
                        min="0"
                        step="0.01"
                        value={creditLimit}
                        onChange={(e) => setCreditLimit(e.target.value)}
                        onBlur={(e) => handleBlur('creditLimit', e.target.value)}
                        placeholder="Enter your credit limit (optional)"
                        className={errors.creditLimit && touched.creditLimit ? 'border-destructive' : ''}
                      />
                      {errors.creditLimit && touched.creditLimit && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.creditLimit}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Loan Fields */}
              {selectedProductType === 'loan' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">
                      Original Loan Amount (BND)
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      onBlur={(e) => handleBlur('loanAmount', e.target.value)}
                      placeholder="Enter the original loan amount"
                      className={errors.loanAmount && touched.loanAmount ? 'border-destructive' : ''}
                    />
                    {errors.loanAmount && touched.loanAmount && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.loanAmount}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outstandingBalance">
                      Outstanding Balance (BND)
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      id="outstandingBalance"
                      type="number"
                      min="0"
                      step="0.01"
                      value={outstandingBalance}
                      onChange={(e) => setOutstandingBalance(e.target.value)}
                      onBlur={(e) => handleBlur('outstandingBalance', e.target.value)}
                      placeholder="Enter remaining loan balance"
                      className={errors.outstandingBalance && touched.outstandingBalance ? 'border-destructive' : ''}
                    />
                    {errors.outstandingBalance && touched.outstandingBalance && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.outstandingBalance}
                      </p>
                    )}
                  </div>

                  {showMonthlyPayment && (
                    <div className="space-y-2">
                      <Label htmlFor="monthlyPayment">Monthly Payment (BND) (Optional)</Label>
                      <Input
                        id="monthlyPayment"
                        type="number"
                        min="0"
                        step="0.01"
                        value={monthlyPayment}
                        onChange={(e) => setMonthlyPayment(e.target.value)}
                        onBlur={(e) => handleBlur('monthlyPayment', e.target.value)}
                        placeholder="Enter your monthly payment amount (optional)"
                        className={errors.monthlyPayment && touched.monthlyPayment ? 'border-destructive' : ''}
                      />
                      {errors.monthlyPayment && touched.monthlyPayment && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.monthlyPayment}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Debit Card - No balance fields, only date */}

              {/* Opened Date - Optional for all types */}
              {showOpenedDate && (
                <div className="space-y-2">
                  <Label>Opened Date (Optional)</Label>
                  <DatePicker
                    value={openedDate}
                    onChange={setOpenedDate}
                    placeholder="Select date when you opened this product"
                  />
                </div>
              )}

              {/* Show general error if validation fails on submit */}
              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please fix the errors above before submitting.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => handleDialogClose(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                (!editProduct && !selectedProductId) ||
                !selectedProductType ||
                addProductMutation.isPending ||
                updateProductMutation.isPending
              }
            >
              {editProduct ? 'Update' : 'Add'} Product
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
