import { headerImageUrl } from "@/data/images";
import { Button } from "../ui/button";
import { MarketingButton } from "../ui/marketing-button";
import styles from "./PricingSection.module.css";

const tiers = [
  {
    name: "Starter",
    price: "€150/mo",
    description:
      "For small teams and startups. All core features, up to 10 projects.",
    features: ["Up to 10 projects", "Basic analytics", "Email support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "€400/mo",
    description:
      "For growing teams. Advanced features, priority support, unlimited projects.",
    features: ["Unlimited projects", "Advanced analytics", "Priority support"],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "For large organizations. Custom integrations, SLAs, and onboarding.",
    features: ["Custom integrations", "Dedicated manager", "SLA & onboarding"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section
      className="relative py-24 px-2 sm:px-6 md:px-12 flex flex-col items-center justify-center"
      style={{ minHeight: 600 }}
    >
      {/* Background */}
      <div
        className="absolute w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,10,0.4)), url('${headerImageUrl}')`,
          zIndex: 0,
        }}
      />

      <div className={styles.noiseOverlay} />
      <div className={styles.orangeOverlay} />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <h2 className="text-4xl sm:text-5xl font-light text-white text-center mb-12">
          Pricing that doesn't empty your wallet
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col items-start shadow-xl transition-all max-w-xs w-full mx-auto ${
                tier.highlight ? "ring-1 ring-primary/40 scale-105" : ""
              }`}
            >
              <h3 className=" text-white mb-2 text-left">{tier.name}</h3>
              <div className="text-3xl font-bold text-white h-20 text-left">
                {tier.price}
              </div>
              <p className="text-white/80 mb-6 text-left h-20">
                {tier.description}
              </p>
              <ul className="mb-8 space-y-2 w-full">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-white/90 flex items-center gap-2 text-left"
                  >
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <MarketingButton
                variant={tier.highlight ? "primary" : "outline"}
                className="w-full"
              >
                {tier.cta}
              </MarketingButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
