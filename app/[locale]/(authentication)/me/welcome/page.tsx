import Welcome from "@/components/ui/Form/WelcomeForm";

async function WelcomePage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-custom-black"> 
      <section className="mx-auto max-w-xs self-center flex flex-col gap-8 text-center" >
        <h1 className="text-white text-2xl text-center m-auto mt-10 ">
          Bienvenue
        </h1>
      </section>

      <section className="max-w-xl mx-auto flex justify-center w-full right-0 px-8 top-0 py-4 bg-custom-black items-center">
        <Welcome />
      </section>
    </div>
  );
}

export default WelcomePage;