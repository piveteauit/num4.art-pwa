import TimelineProps from "@/types/timeline";
import ScrollObserver from "./ScrollObserver";
import Image from "next/image";
import BetterIcon from "./sf/BetterIcon";

function Timeline({ items }: { items: TimelineProps }) {
  return (
    <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical py-4">
      {items.map(
        ({ description, title, url, element, marker, image }, k: number) => (
          <li key={`timeline-item-${k}`}>
            {!(k % 2) ? <hr /> : null}

            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div
              className={`p-5 pt-0 relative ${!(k % 2) ? "timeline-start md:text-end" : "timeline-end md:text-start"} mb-10`}
            >
              <ScrollObserver
                threshold={0}
                classes={[
                  "opacity-0 absolute h-full w-full",
                  "opacity-1 absolute h-full w-full"
                ]}
              >
                <div className="absolute bg-white h-full w-[90%] top-0" />
              </ScrollObserver>
              <time className="font-mono italic"> {marker || ""} </time>
              <a
                target="_blank"
                href={url}
                className={`text-lg flex items-center ${k % 2 ? "justify-start" : "justify-end"} font-black relative z-20 my-3`}
              >
                <span className="h-18">{title || ""}</span>
                <div className="w-8 h-12 inline-flex items-center justify-end rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="18"
                    height="18"
                    viewBox="0 0 48 48"
                  >
                    <path d="M 41.470703 4.9863281 A 1.50015 1.50015 0 0 0 41.308594 5 L 27.5 5 A 1.50015 1.50015 0 1 0 27.5 8 L 37.878906 8 L 22.439453 23.439453 A 1.50015 1.50015 0 1 0 24.560547 25.560547 L 40 10.121094 L 40 20.5 A 1.50015 1.50015 0 1 0 43 20.5 L 43 6.6894531 A 1.50015 1.50015 0 0 0 41.470703 4.9863281 z M 12.5 8 C 8.3754991 8 5 11.375499 5 15.5 L 5 35.5 C 5 39.624501 8.3754991 43 12.5 43 L 32.5 43 C 36.624501 43 40 39.624501 40 35.5 L 40 25.5 A 1.50015 1.50015 0 1 0 37 25.5 L 37 35.5 C 37 38.003499 35.003499 40 32.5 40 L 12.5 40 C 9.9965009 40 8 38.003499 8 35.5 L 8 15.5 C 8 12.996501 9.9965009 11 12.5 11 L 22.5 11 A 1.50015 1.50015 0 1 0 22.5 8 L 12.5 8 z"></path>
                  </svg>
                </div>
              </a>
              <div
                className="relative z-10"
                dangerouslySetInnerHTML={{ __html: description || "" }}
              />
            </div>

            {(element || image) && (
              <div
                className={`p-5 ${k % 2 ? "timeline-start md:text-end" : "timeline-end md:text-start"} my-10 relative w-full h-full mx-auto`}
              >
                <div className="text-lg font-black flex flex-row-reverse justify-center items-center px-10 h-full">
                  {image && (
                    <div className="flex-[2] relative">
                      <Image
                        className="object-contain"
                        responsivefill"
                        src={image.src}
                        alt={image.name}
                      />
                    </div>
                  )}

                  {element && <div className="flex-[1]">{element}</div>}
                </div>
              </div>
            )}

            <hr />

            {k % 2 ? <hr /> : null}
          </li>
        )
      )}
    </ul>
  );
}

export default Timeline;
