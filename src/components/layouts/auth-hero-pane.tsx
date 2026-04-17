import { LOGIN_HERO_IMAGE, REGISTER_TEXTURE } from "@/assets/auth-layout-assets";

type AuthHeroPaneProps = {
  variant: "login" | "register";
};

export function AuthHeroPane({ variant }: AuthHeroPaneProps) {
  if (variant === "login") {
    return (
      <section className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-[#0c0f0f] p-20 lg:flex">
        <div className="absolute inset-0 z-0">
          <div className="absolute left-[-10%] top-[-10%] h-[70%] w-[70%] rounded-full bg-[#6b1ef3] opacity-30 blur-[120px]" />
          <div className="absolute bottom-[-5%] right-[-5%] h-[60%] w-[60%] rounded-full bg-[#00618f] opacity-25 blur-[100px]" />
          <div className="absolute right-[10%] top-[20%] h-[40%] w-[40%] rounded-full bg-[#5f00e2] opacity-20 blur-[80px]" />
          <div className="absolute inset-0 overflow-hidden opacity-40 mix-blend-screen">
            <img alt="" className="h-full w-full object-cover" src={LOGIN_HERO_IMAGE} />
          </div>
        </div>
        <div className="relative z-10 max-w-lg">
          <div className="space-y-6">
            <p className="font-editorial-serif text-4xl italic leading-snug text-white">
              &ldquo;If your car is too comfortable, you&rsquo;re probably not going fast
              enough.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#6b1ef3]" />
              <span className="font-editorial text-xs uppercase tracking-[0.2em] text-[#eaf4ff]/60">
                Lewis Hamilton
              </span>
            </div>
          </div>
          <div className="absolute bottom-20 left-20 flex gap-4">
            <div className="size-2 rounded-full bg-white" />
            <div className="size-2 rounded-full bg-white/20" />
            <div className="size-2 rounded-full bg-white/20" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative hidden w-1/2 overflow-hidden bg-[#0c0f0f] lg:flex">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-[-10%] top-[-10%] h-[120%] w-[120%] rotate-12 scale-110 bg-gradient-to-tr from-[#6b1ef3] via-[#00618f] to-[#5f00e2] opacity-40 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-full w-full bg-gradient-to-bl from-[#4cb9ff] via-[#6b1ef3] to-transparent opacity-30 blur-[100px]" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-10 mix-blend-overlay"
        style={{ backgroundImage: `url(${REGISTER_TEXTURE})` }}
      />
      <div className="relative z-10 flex min-h-screen w-full flex-col justify-center p-16">
        <div className="max-w-md">
          <h2 className="mb-6 font-editorial-serif text-5xl font-bold leading-tight text-white">
            Run your ISP from one clear command center.
          </h2>
          <p className="font-editorial text-lg leading-relaxed text-[#f7f0ff]/80">
            ISP Connect brings network health, subscriber lifecycle, and billing signals into a
            single dashboard—so ops and customer teams stay aligned on the same live data.
          </p>
        </div>
      </div>
    </section>
  );
}
