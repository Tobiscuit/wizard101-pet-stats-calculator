import { Calculator } from "@/components/Calculator"


export const metadata = {
  title: "Pet Stats Calculator | The Commons",
  description: "Optimize your pet's stats for Damage, Resist, and Pierce.",
}

export default function CalculatorPage() {
  return (
    <>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="max-w-4xl mx-auto w-full py-8">
            <Calculator />
        </div>
      </div>
    </>
  )
}
