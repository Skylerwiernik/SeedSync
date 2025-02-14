'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React from 'react'

// import HeaderBar from './Header';


import { useRouter } from 'next/navigation';

export default function Home() {
  const [redraw, forceRedraw] = React.useState(0); // Used to conveniently request redraw after model change

  // for button
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  // enabled state, boolean state with completion = set it, by setting = new state created

  // localStorage.setItem("chosenRestaurant", selectedRestaurant);

  // Whenever 'redraw' changes (and there are no loaded restaurants) this fetches from API
  //AwzznqgiOcnxC0HFB3ZW
  React.useEffect(() => {
  }, [redraw]);

  // Utility method for refreshing display in React
  const andRefreshDisplay = () => {
    forceRedraw(redraw + 1);
  };

  return (
    <main className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-red-900">
        Welcome to Tables4U
        </h2>
      </div>

</main>

  );
}
