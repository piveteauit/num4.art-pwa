import Welcome from "@/components/ui/Form/WelcomeForm";

async function WelcomePage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-custom-black"> 
      <section className="mx-auto max-w-xs self-center flex flex-col gap-8 text-center" style={{ backgroundColor: '#191919' }}>
        <h1 className="text-primary text-2xl text-center m-auto mt-10"style={{ backgroundColor: '#191919' }}>
          Bienvenue
        </h1>
      </section>

      <section className="max-w-xl mx-auto flex justify-center w-full right-0 px-8 top-0 py-4 bg-base items-center"style={{ backgroundColor: '#191919' }}>
        <Welcome />
      </section>
    </div>
  );
}

export default WelcomePage;