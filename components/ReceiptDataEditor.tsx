"use client";

import { Receipt } from "@/actions/parseReceiptFromImage";
import { useState } from "react";

export default function ReceiptDataEditor({
  receipt,
  onSubmit
}: Readonly<{
  receipt: NonNullable<Receipt["result"]>,
  onSubmit(data: NonNullable<Receipt["result"]>): Promise<any>
}>) {
  const [items, setItems] = useState(receipt.items);
  const [serviceCharge, setServiceCharge] = useState(receipt.serviceCharge || 0);
  const [tip, setTip] = useState(receipt.tip || 0);
  const [tax, setTax] = useState(receipt.tax || 0);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  async function handleSubmit() {
    setButtonsDisabled(true);
    await onSubmit({...receipt, items: items});
    setButtonsDisabled(false);
  }

  const total = (items.reduce((total, { price }) => total + price, 0) + serviceCharge + tip + tax).toFixed(2);

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-scroll">
        <table className="table table-pin-rows">
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
          {
            items.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div className="join">
                      <span className="btn font-bold cursor-pointer px-2" onClick={() => {
                        const itemsClone = [...items];
                        itemsClone[index].count = itemsClone[index].count === 1 ? 1 : itemsClone[index].count - 1;
                        setItems(itemsClone);
                      }}>-</span>
                      &nbsp;
                      <input className="input w-8 text-center px-0" value={item.count} type="text" onChange={(event) => {
                        const itemsClone = [...items];
                        itemsClone[index].count = parseInt(event.target.value) >= 1 ? parseInt(event.target.value) : 1;
                        setItems(itemsClone);
                      }}/>
                      &nbsp;
                      <span className="btn font-bold px-2" onClick={() => {
                        const itemsClone = [...items];
                        itemsClone[index].count++;
                        setItems(itemsClone);
                      }}>+</span>
                    </div>
                  </td>
                  <td>
                    <span>{item.name}</span>
                  </td>
                  <td>
                    <input className="input appearance-none w-16" defaultValue={item.price.toFixed(2)} type="number" onChange={(event) => {
                      const itemsClone = [...items];
                      itemsClone[index].price = parseFloat(event.target.value) >= 0 ? parseFloat(event.target.value) : 0;
                      setItems(itemsClone);
                    }}/>
                  </td>
                </tr>
                // <div key={index} className="flex flex-row bg-base-300 border-b p-2 gap-4">
                //   <div className="join">
                //     <span className="btn font-bold cursor-pointer">-</span>
                //     &nbsp;
                //     <span className="input">{item.count}</span>
                //     &nbsp;
                //     <span className="btn font-bold">+</span>
                //   </div>
                //   <span className="p-2">{item.name}</span>
                //   <span>{item.price}</span>
                // </div>
              )
            })
          }
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center gap-2 p-2 border-t-1 border-t-neutral-300">
        <div className="flex flex-row w-full justify-around">
          <label>
            <span className="font-bold p-1">Service Charge:</span>
            &nbsp;
            <input className="input w-16 h-[2.5em] px-1" type="number" defaultValue={serviceCharge.toFixed(2)} onChange={(event) => setServiceCharge(+event.target.value || 0)} />
          </label>
          <label>
            <span className="font-bold p=1">Tip:</span>
            &nbsp;
            <input className="input w-16 h-[2.5em] px-1" type="number" defaultValue={tip.toFixed(2)} onChange={(event) => setTip(+event.target.value || 0)} />
          </label>
        </div>
        <div className="flex flex-row w-full justify-around">
          <label>
            <span className="font-bold p-1">Tax:</span>
            &nbsp;
            <input className="input w-16 h-[2.5em] px-1" type="number" defaultValue={tax.toFixed(2)} onChange={(event) => setTax(+event.target.value || 0)} />
          </label>
          <label>
            <span className="font-bold p=1">Total:</span>
            &nbsp;
            <input className="input w-16 h-[2.5em] px-1" value={total} readOnly/>
          </label>
        </div>
        <button className="btn btn-primary cursor-pointer w-full sm:w-auto" disabled={buttonsDisabled} onClick={handleSubmit}>Done</button>
      </div>
    </div>
  );
  // return (
  //   <div className="flex flex-col h-full w-full">
  //     {
  //       receipt.items.map((item, index) => {
  //         return (
  //           <div key={index} className="flex flex-row bg-base-300 border-b p-2 gap-4">
  //             <div className="join">
  //               <span className="btn font-bold cursor-pointer">-</span>
  //               &nbsp;
  //               <span className="input">{item.count}</span>
  //               &nbsp;
  //               <span className="btn font-bold">+</span>
  //             </div>
  //             <span className="p-2">{item.name}</span>
  //             <span>{item.price}</span>
  //           </div>
  //         )
  //       })
  //     }
  //   </div>
  // );
}