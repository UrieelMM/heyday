export function RsvpExtras({ phone, previewMessage }: { phone?: string; previewMessage?: string }) {
  const digits = phone?.replace(/\D/g, '') ?? '';
  const international = digits.length === 10 ? `52${digits}` : digits;
  return (
    <>
      {previewMessage && (
        <div className="mt-5 rounded-lg border border-current/20 p-3 text-center text-sm">
          <p className="mb-1 font-semibold">Mensaje después de confirmar</p>
          <p>{previewMessage}</p>
        </div>
      )}
      {international && (
        <p className="mt-5 text-center text-sm">
          <a href={`https://wa.me/${international}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            Consultar por WhatsApp
          </a>
        </p>
      )}
    </>
  );
}
