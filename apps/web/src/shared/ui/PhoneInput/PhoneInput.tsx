import { forwardRef, useEffect, useRef, useState } from "react";
import { MaskInput, type MaskInputProps } from "@mantine/core";
import { useMergedRef } from "@mantine/hooks";
import { formatRussianPhone } from "@/shared/lib/format-russian-phone";
import { normalizeRussianPhone } from "@/shared/lib/normalize-russian-phone";

type PhoneInputProps = Omit<MaskInputProps, "mask"> & {
  mask?: MaskInputProps["mask"];
};

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput(
    {
      mask = "+7 (999) 999-99-99",
      defaultValue,
      value,
      onChange,
      onPaste,
      ...props
    },
    forwardedRef,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef(inputRef, forwardedRef);
    const [internalValue, setInternalValue] = useState(
      String(defaultValue ?? ""),
    );
    const [pasteVersion, setPasteVersion] = useState(0);

    useEffect(() => {
      if (!pasteVersion) return;
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length,
      );
    }, [pasteVersion]);

    return (
      <MaskInput
        ref={mergedRef}
        label="Телефон"
        placeholder="+7 (___) ___-__-__"
        mask={mask}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        value={value ?? internalValue}
        onChange={(event) => {
          setInternalValue(event.currentTarget.value);
          onChange?.(event);
        }}
        onPasteCapture={(event) => {
          onPaste?.(event);
          if (event.defaultPrevented) return;
          const normalized = normalizeRussianPhone(
            event.clipboardData.getData("text"),
          );
          if (!normalized) return;
          event.preventDefault();
          const formatted = formatRussianPhone(normalized);
          const valueSetter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value",
          )?.set;
          valueSetter?.call(event.currentTarget, formatted);
          event.currentTarget.dispatchEvent(
            new Event("input", { bubbles: true }),
          );
          queueMicrotask(() => {
            setInternalValue(formatted);
            setPasteVersion((current) => current + 1);
          });
        }}
        {...props}
      />
    );
  },
);
