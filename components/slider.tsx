import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import { useEffect, useState } from "react"

export function CarouselSize() {
  const tab = [
    { img: "/obraz.jpg", title: "Mikołaj" },
    { img: "/obraz1.jpg", title: "Mikołaj" },
    { img: "/obraz2.jpg", title: "Mikołaj" },
    { img: "/obraz3.jpg", title: "Mikołaj" },
    { img: "/obraz4.jpg", title: "Mikołaj" },
    { img: "/obraz5.jpg", title: "Mikołaj" },
    { img: "/obraz6.jpg", title: "Mikołaj" },
  ]

  const [api, setApi] = useState<any>(null)

  useEffect(() => {
    if (!api) return

    const autoplay = setInterval(() => {
      api.scrollNext()
    }, 4000) // Zmienia się co 4 sekundy

    return () => clearInterval(autoplay)
  }, [api])

  return (
    <Carousel
      opts={{
        align: "start",
        containScroll: "trimSnaps",
        slidesToScroll: 1,
        loop: true,
      }}
      setApi={setApi}
      className="mb-[5rem] w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <CarouselContent className="-ml-0">
        {tab.map((item, index) => (
          <CarouselItem key={index} className="basis-full pl-0 sm:basis-1/2 lg:basis-1/3">
            <div className="p-0">
              <Card className="rounded-none">
                <CardContent className="flex aspect-[4/3] h-auto w-full items-center justify-center p-0">
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={800}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
