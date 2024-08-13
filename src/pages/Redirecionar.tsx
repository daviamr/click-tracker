export function RedirecionarPage() {

  return (
    <>
      <div className="h-screen w-screen bg-slate-200 flex flex-col items-center justify-center">

        <div className="flex flex-col items-center gap-8">

            <div>
                <img
                src="/asdasd"
                alt="imagem cliente"
                className="text-xs text-cyan-600"/>
            </div>

          <svg
            className="animate-spin h-5 w-5 mr-3 bg-cyan-600"
            viewBox="0 0 24 24"
          ></svg>
          <p className="text-cyan-600 font-semibold text-2xl animate-pulse">
            Redirecionando...
          </p>
        </div>
        
      </div>
    </>
  );
}
