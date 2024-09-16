export function formatErrorMessage(error: Error): string {
  console.log(error);
  
  const revertReasonMatch = error.message.match(
    /reverted with reason string '(.+)'/
  );
  if (revertReasonMatch) {
    return revertReasonMatch[1];
  }
  

  const contractFunctionMatch = error.message.match(
    /The contract function .+ reverted with the following reason:\s*(.+)/
  );
  if (contractFunctionMatch) {
    return contractFunctionMatch[1];
  }

  return "Something went wrong";
}
