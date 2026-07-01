import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // The `type` param in the URL hash tells us the flow:
    //   type=recovery → password-reset session already established by SDK
    //   type=signup   → email confirmation, wait for SIGNED_IN event
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
    const type = params.get("type");

    if (type === "recovery") {
      navigate("/reset-password", { replace: true });
      return;
    }

    // Signup confirmation - wait for the Supabase SDK to fire SIGNED_IN
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const { data } = await supabase
            .from("profiles")
            .select("onboarded")
            .eq("id", session.user.id)
            .single();
          navigate(data?.onboarded ? "/" : "/onboarding", { replace: true });
        }
      }
    );

    // Fallback: redirect after 6 s if the auth event never fires
    const fallback = setTimeout(() => navigate("/signin", { replace: true }), 6000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallback);
    };
  }, [navigate]);

  return (
    <div className="auth-cb-wrap">
      <div className="auth-cb-spinner" />
      <p>Confirming your account…</p>
    </div>
  );
}
