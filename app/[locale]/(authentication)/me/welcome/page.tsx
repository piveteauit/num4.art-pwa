import Welcome from "@/components/ui/Form/WelcomeForm";

async function WelcomePage() {
  return (
    <main className="flex flex-col h-screen w-screen items-center p-10">
      <section className="max-w-xl mx-auto flex justify-between w-full right-0 px-8 top-0 py-4 bg-base items-center">
        <h1 className="text-primary text-2xl text-center m-auto mt-10">
          Bienvenue
        </h1>
      </section>

      <section className="max-w-xl mx-auto flex justify-between w-full right-0 px-8 top-0 py-4 bg-base items-center">
        <Welcome />
      </section>
    </main>
  );
}

export default WelcomePage;
