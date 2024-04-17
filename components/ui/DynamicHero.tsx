import Image from "next/image";
import TestimonialsAvatars from "./sf/TestimonialsAvatars";
import config from "@/config";
import { DynamicHeroProps } from "@/types/dynamic-hero";
import ScrollObserver from "./ScrollObserver";

function DynamicHero({ title, slogan, description }: DynamicHeroProps) {
  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        <div className="avatar">
          <div className="rounded-full w-32 border-slate-600 border-2 shadow-lg shadow-slate-800">
            <Image
              src="/assets/images/avatar.jpg"
              alt="Product Demo"
              className="w-full mt-[30px] overflow-visible"
              priority={true}
              width={577}
              height={928}
            />
          </div>
        </div>

        <ScrollObserver classes={["opacity-1", "opacity-0"]}>
          <h1 className="font-extrabold text-3xl lg:text-4xl tracking-tight md:-mb-4">
            {title}
          </h1>
        </ScrollObserver>
        <ScrollObserver classes={["opacity-1", "opacity-0"]}>
          <p className="text-lg opacity-80 leading-relaxed">{slogan}</p>
        </ScrollObserver>
        <ScrollObserver classes={["opacity-1", "opacity-0"]}>
          <p className="text-lg opacity-80 leading-relaxed">{description}</p>
        </ScrollObserver>
        {/* <button className="btn btn-primary btn-wide">
          Get {config.appName}
        </button> */}

        {/* <TestimonialsAvatars priority={true} /> */}
      </div>
      <div className="lg:w-full rounded-lg overflow-hidden shadow-lg shadow-slate-900">
        <Image
          src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
          alt="Product Demo"
          className="w-full"
          priority={true}
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}

export default DynamicHero;
