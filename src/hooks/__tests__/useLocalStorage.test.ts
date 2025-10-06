import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
  });

  it('initializes with default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    
    expect(result.current[0]).toBe('default-value');
  });

  it('reads existing value from localStorage', () => {
    // Set up localStorage
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('updates value and localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
  });

  it('removes value from localStorage when removeValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    
    act(() => {
      result.current[2]();
    });
    
    expect(result.current[0]).toBe('default-value');
    expect(localStorage.removeItem).toHaveBeenCalledWith('test-key');
  });

  it('handles function updates correctly', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));
    
    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
  });

  it('handles localStorage errors gracefully', () => {
    // Mock localStorage.setItem to throw an error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem = vi.fn().mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    // Should still update local state even if localStorage fails
    expect(result.current[0]).toBe('new-value');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('debounces localStorage writes when debounceMs is set', async () => {
    vi.useFakeTimers();
    
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'default-value', { debounceMs: 100 })
    );
    
    act(() => {
      result.current[1]('value1');
      result.current[1]('value2');
      result.current[1]('value3');
    });
    
    // localStorage should not be called immediately
    expect(localStorage.setItem).not.toHaveBeenCalled();
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // localStorage should be called once with the last value
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('value3'));
    
    vi.useRealTimers();
  });

  it('syncs across tabs when storage event occurs', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    
    // Simulate storage event from another tab
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'test-key',
        newValue: JSON.stringify('tab-sync-value'),
        oldValue: null,
        storageArea: localStorage,
      });
      
      window.dispatchEvent(storageEvent);
    });
    
    expect(result.current[0]).toBe('tab-sync-value');
  });
}); 