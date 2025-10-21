import SignInForm from "./SignInForm";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const callbackUrl = searchParams?.callbackUrl ?? "/dashboard";
  const error = searchParams?.error ?? "";
  return <SignInForm callbackUrl={callbackUrl} error={error} />;
}
