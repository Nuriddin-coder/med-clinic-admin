import * as React from 'react';
import { cn } from '@/utils/cn';
import { AlertCircle, Phone } from 'lucide-react';
import { formatUzbekPhone, toCleanPhone } from '@/utils/format';

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string;
  onChange?: (cleanValue: string, formattedValue: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      containerClassName,
      id,
      value,
      onChange,
      placeholder = '+998 90 123 45 67',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const [displayValue, setDisplayValue] = React.useState<string>(() =>
      formatUzbekPhone(value)
    );

    React.useEffect(() => {
      const formatted = formatUzbekPhone(value);
      setDisplayValue(formatted);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const cursor = input.selectionStart || 0;
      const rawText = input.value;

      let rawDigits = rawText.replace(/\D/g, '');
      if (rawDigits.startsWith('998')) {
        rawDigits = rawDigits.slice(3);
      }
      rawDigits = rawDigits.slice(0, 9);

      if (!rawDigits) {
        setDisplayValue('');
        onChange?.('', '');
        return;
      }

      // Count subscriber digits before cursor
      const textBefore = rawText.slice(0, cursor);
      let subDigitsBefore = textBefore.replace(/\D/g, '');
      if (subDigitsBefore.startsWith('998')) {
        subDigitsBefore = subDigitsBefore.slice(3);
      }
      const targetDigitIndex = subDigitsBefore.length;

      const formatted = formatUzbekPhone(rawDigits);
      const clean = toCleanPhone(rawDigits);

      setDisplayValue(formatted);
      onChange?.(clean, formatted);

      // Restore cursor position
      requestAnimationFrame(() => {
        if (!input) return;
        if (targetDigitIndex === 0) {
          input.setSelectionRange(5, 5);
          return;
        }

        let counted = 0;
        let newCursor = formatted.length;
        for (let i = 5; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) counted++;
          if (counted === targetDigitIndex) {
            newCursor = i + 1;
            break;
          }
        }
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
          // If backspacing at or before '+998 ', clear entire field
          if (selectionStart <= 5) {
            e.preventDefault();
            setDisplayValue('');
            onChange?.('', '');
            return;
          }

          // If previous char is a space, delete the digit before the space
          if (currentVal[selectionStart - 1] === ' ') {
            e.preventDefault();
            const before = currentVal.slice(0, selectionStart - 2);
            const after = currentVal.slice(selectionStart);
            let cleanDigits = (before + after).replace(/\D/g, '');
            if (cleanDigits.startsWith('998')) {
              cleanDigits = cleanDigits.slice(3);
            }
            cleanDigits = cleanDigits.slice(0, 9);

            const formatted = cleanDigits ? formatUzbekPhone(cleanDigits) : '';
            const clean = cleanDigits ? toCleanPhone(cleanDigits) : '';

            setDisplayValue(formatted);
            onChange?.(clean, formatted);

            const newCursor = Math.max(5, selectionStart - 2);
            requestAnimationFrame(() => {
              input.setSelectionRange(newCursor, newCursor);
            });
          }
        }
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!displayValue) {
        setDisplayValue('+998 ');
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(5, 5);
          }
        });
      }
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // If only '+998' or '+998 ' remains, reset to empty
      if (displayValue.trim() === '+998') {
        setDisplayValue('');
        onChange?.('', '');
      }
      props.onBlur?.(e);
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
          <div className="absolute left-3 text-slate-400 flex items-center pointer-events-none">
            <Phone className="w-4 h-4" />
          </div>

          <input
            ref={inputRef}
            id={inputId}
            type="tel"
            autoComplete="tel"
            value={displayValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex h-9 w-full rounded-lg border bg-white pl-9 pr-3 py-1 text-sm shadow-2xs transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 font-medium text-slate-800 tracking-wide',
              error
                ? 'border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-200'
                : 'border-slate-200 hover:border-slate-300 focus-visible:border-emerald-500',
              className
            )}
            {...props}
          />
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

PhoneInput.displayName = 'PhoneInput';

