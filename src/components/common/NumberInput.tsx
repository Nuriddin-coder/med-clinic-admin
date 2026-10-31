import * as React from 'react';
import { cn } from '@/utils/cn';
import { AlertCircle } from 'lucide-react';
import { formatNumberWithSpaces } from '@/utils/format';

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number | string;
  onChange?: (value: number, formatted: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  suffix?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      suffix,
      leftIcon,
      rightIcon,
      containerClassName,
      id,
      value,
      onChange,
      placeholder = '0',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // Merge forwarded ref and internal ref
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const [displayValue, setDisplayValue] = React.useState<string>(() =>
      formatNumberWithSpaces(value)
    );

    React.useEffect(() => {
      const formatted = formatNumberWithSpaces(value);
      setDisplayValue(formatted);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const cursor = input.selectionStart || 0;
      const rawText = input.value;

      // Count digits before cursor to restore position
      const digitsBeforeCursor = rawText.slice(0, cursor).replace(/\D/g, '').length;
      const cleanDigits = rawText.replace(/\D/g, '');
      const formatted = formatNumberWithSpaces(cleanDigits);
      const numValue = cleanDigits ? parseInt(cleanDigits, 10) : 0;

      setDisplayValue(formatted);
      onChange?.(numValue, formatted);

      // Restore cursor position
      requestAnimationFrame(() => {
        if (!input) return;
        let newCursor = 0;
        let digitsCounted = 0;
        for (let i = 0; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) {
            digitsCounted++;
          }
          if (digitsCounted === digitsBeforeCursor) {
            newCursor = i + 1;
            break;
          }
        }
        if (digitsBeforeCursor === 0) newCursor = 0;
        if (digitsBeforeCursor >= cleanDigits.length) newCursor = formatted.length;
        input.setSelectionRange(newCursor, newCursor);
      });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        const input = e.currentTarget;
        const { selectionStart, selectionEnd, value: currentVal } = input;
        if (
          selectionStart !== null &&
          selectionStart === selectionEnd &&
          selectionStart > 0
        ) {
          if (currentVal[selectionStart - 1] === ' ') {
            e.preventDefault();
            const before = currentVal.slice(0, selectionStart - 2);
            const after = currentVal.slice(selectionStart);
            const cleanDigits = (before + after).replace(/\D/g, '');
            const formatted = formatNumberWithSpaces(cleanDigits);
            const numValue = cleanDigits ? parseInt(cleanDigits, 10) : 0;

            setDisplayValue(formatted);
            onChange?.(numValue, formatted);

            const newCursor = Math.max(0, selectionStart - 2);
            requestAnimationFrame(() => {
              input.setSelectionRange(newCursor, newCursor);
            });
          }
        }
      }
    };

    const inputId = id || props.name;

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 z-10 text-slate-400 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={inputRef}
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={displayValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex h-9 w-full rounded-lg border bg-white px-3 py-1 text-sm shadow-2xs transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 font-medium text-slate-800',
              leftIcon && 'pl-9',
              suffix ? 'pr-16' : rightIcon ? 'pr-9' : '',
              error
                ? 'border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-200'
                : 'border-slate-200 hover:border-slate-300 focus-visible:border-emerald-500',
              className
            )}
            {...props}
          />

          {suffix ? (
            <div className="absolute right-3 text-xs font-semibold text-slate-400 pointer-events-none select-none bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">
              {suffix}
            </div>
          ) : rightIcon ? (
            <div className="absolute right-3 text-slate-400 flex items-center">
              {rightIcon}
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="flex items-center gap-1 text-xs text-rose-600 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

