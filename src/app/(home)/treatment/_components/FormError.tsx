interface FieldError {
  message: string;
}

export function FormErrorDisplay({ formState }:{formState:any}) {
  const errorCount = Object.keys(formState.errors).length;
  
  if (errorCount === 0) return null;
  
  return (
    <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-600">
      <p className="font-medium">Please correct the following errors:</p>
      <ul className="list-disc pl-4 mt-2">
        {Object.entries(formState.errors).map(([field, error], index) => (
          <li key={index}>{(error as FieldError).message}</li>
        ))}
      </ul>
    </div>
  );
}