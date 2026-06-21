import {useEffect, useState} from "react"
type Order = {
  id:number,
  customerName:string,
  coffeeType:string,
  status:string
}
export default function App(){
  const [orders,setOrders]=useState<Order[]>(() => {
    const saved=localStorage.getItem('orders')
    return saved? JSON.parse(saved):[]
  })
  const [inpVal,setInpVal]=useState('')
  const [cofType,setCofType]=useState('Латте')
  const [filter,setFilter]=useState<"pending" | "done" | "all">("all")
  const [counter,setCounter]=useState(0)
  const filtered = orders.filter(t => {
    if (filter === "pending") return t.status === "pending"
    if (filter === "done")   return t.status === "done"
    return true
  })
  const handleAddOrder = () => {
    if (inpVal.trimStart().trimStart()==="") return
    const newOrder: Order = {
      id: counter,
      customerName: inpVal.trimStart().trimEnd(),
      coffeeType: cofType,
      status: "pending",
    }
    setOrders([...orders,newOrder])
    setCounter(counter+1)
    setInpVal("")
  }
  const handleDeleteOrder = ( id:number ) => {
    setOrders(orders.filter(or => or.id!==id))
  }
  const handleChangeStatusOrder = ( id:number ) => {
    setOrders(orders.map(or => or.id===id? {...or,status: "done"}:or))
  }
  useEffect(() => {
    localStorage.setItem('orders',JSON.stringify(orders))
  }, [orders])
  return <div className="min-h-screen  bg-gray-100 flex justify-center pt-16 px-4">
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-12 ">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Кофейня RyFera</h1>
      <div className="flex gap-3 my-5">
        {(["all", "pending", "done"] as const).map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={`rounded-2xl px-3 py-2 font-medium transition-colors 
                ${filter===f?'bg-blue-500 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {{ all: "Все", pending: "Активные", done: "Сделанные" }[f]}
              </button>
          ))}
      </div>
      <ul className="mb-4 flex flex-col gap-4 rounded-xl py-4 border-2 border-gray-300">
        {
          filtered.map(f => (
            <li key={f.id} className="border-b-2 border-gray-300 px-5">
              <div className="flex justify-between">
                <span className={`flex-1 text-md ${f.status==="done"?'font-bold':'font-medium'}`}>
                  {f.customerName} : {f.coffeeType} : {f.status==="pending"?"Готовится":"Готов"}
                </span>
                <div className="flex gap-2">
                  <button className="rounded-full hover:text-gray-400 transition-colors" onClick={() => handleChangeStatusOrder(f.id)}>✓</button>
                  <button className="rounded-full hover:text-gray-400 transition-colors" onClick={() => handleDeleteOrder(f.id)}>X</button>
                </div>             
              </div>
            </li>
          ))
        }
      </ul>
      <div className="flex gap-1 ">
          <input type="text"
          className="border-gray-300 flex-1 border-2 rounded-lg px-2.5 py-1 text-gray-700 outline-none focus:border-blue-400 transition-colors" 
          value={inpVal} onChange={ e => setInpVal(e.target.value) } onKeyDown={e => {
            if (e.key==="Enter")
              handleAddOrder()
            else if(e.key==="Escape")
              setInpVal("")
          }}/>
          <select className="text-gray-800 bg-gray-100 px-4 py-3 rounded-2xl" value={cofType} onChange={ e => setCofType(e.target.value) }>
            <option value="Латте">Латте</option>
            <option value="Раф">Раф</option>
            <option value="Капучинно">Капучинно</option>
            <option value="Американо">Американо</option>
            <option value="Флэт уайт">Флэт уайт</option>
            <option value="Эспрессо">Эспрессо</option>
          </select>
      </div>
      <div className="mt-3 flex">
        <button className="flex-1 font-bold text-xl text-white bg-blue-500 py-2 rounded-3xl" onClick={() => handleAddOrder()}>Добавить заказ</button>
      </div>
    </div>
    
  </div>
}