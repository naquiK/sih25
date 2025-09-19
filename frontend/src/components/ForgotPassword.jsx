import ForgotPasswordLayout from "../components/miniComponents/ForgorPasswordLayout.jsx";
import RecoveryOptions from "../components/miniComponents/RecoveryOptions.jsx";

export default function ForgotPassword() {
  return (
    <ForgotPasswordLayout stepTitle="Step 1: Choose Recovery Method">
      <RecoveryOptions/>
    </ForgotPasswordLayout>
  );
}
