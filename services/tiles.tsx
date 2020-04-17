import React, { useCallback } from 'react';

export interface TileInterface {
  id: number;
  /** Path relative to the public/tiles directory. */
  image: string;
  /** Alt text for the image. */
  alt: string;
  //** idb-keyval key to store extra data used by the tile. */
  idbKey?: string;
  /** React component to ask the user for more detail about why they marked this tile. */
  describe?: (props: { detailString: string; setDetailString: (s: string) => void }) => JSX.Element;
  /** React component to render the user's answer over the main tile. */
  show?: (props: object) => JSX.Element;
}

function DescribeAddYourOwn({ detailString, setDetailString }: { detailString: string; setDetailString: (newValue: string) => void }): JSX.Element {
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDetailString(event.target.value)
  }, [setDetailString]);

  return <div>
    <label>What obstruction did you find?</label>
    <input type="text" value={detailString} onChange={onChange} />
  </div>
}

function ShowAddYourOwn(props: { detailString: string }): JSX.Element {
  return <div style={{ width: "100%", height: "100%" }}>
    {props.detailString}
  </div>
}

const TILES: TileInterface[] = [
  {
    id: 0,
    image: "free_square.svg",
    alt: "Free space",
  },
  {
    id: 1,
    image: "add_your_own_1.svg",
    alt: "Add your own",
    idbKey: "add-your-own-1",
    describe: DescribeAddYourOwn,
    show: ShowAddYourOwn,
  },
  {
    id: 2,
    image: "add_your_own_2.svg",
    alt: "Add your own",
    idbKey: "add-your-own-1",
    describe: DescribeAddYourOwn,
    show: ShowAddYourOwn,
  },
  {
    id: 3,
    image: "a_frame.svg",
    alt: "A-frame sign",
  },
  {
    id: 4,
    image: "bike.svg",
    alt: "Bike riding on sidewalk",
  },
  {
    id: 5,
    image: "car_blocking_crosswalk.svg",
    alt: "Car blocking crosswalk",
  },
  {
    id: 6,
    image: "car_blocking_sidewalk.svg",
    alt: "Car blocking sidewalk",
  },
  {
    id: 7,
    image: "closed_crosswalk.svg",
    alt: "Closed crosswalk",
  },
  {
    id: 8,
    image: "construction.svg",
    alt: "Construction site",
  },
  {
    id: 9,
    image: "dog_poop.svg",
    alt: "Dog poop",
  },
  {
    id: 10,
    image: "missing_curb_ramp.svg",
    alt: "Missing curb ramp",
  },
  {
    id: 11,
    image: "missing_sidewalk.svg",
    alt: "Missing sidewalk",
  },
  {
    id: 12,
    image: "no_lighting.svg",
    alt: "No lighting",
  },
  {
    id: 13,
    image: "overhanging_branch.svg",
    alt: "Low overhanging branches",
  },
  {
    id: 14,
    image: "refuse_bins.svg",
    alt: "Refuse bins in sidewalk",
  },
  {
    id: 15,
    image: "restaurant_seating.svg",
    alt: "Restaurant seating",
  },
  {
    id: 16,
    image: "scooter.svg",
    alt: "Scooter blocking sidewalk",
  },
  {
    id: 17,
    image: "shrubbery_quarter.svg",
    alt: "Shrubbery across at least ¼ of the sidewalk",
  },
  {
    id: 18,
    image: "shrubbery_half.svg",
    alt: "Shrubbery across at least ½ of the sidewalk",
  },
  {
    id: 19,
    image: "slipping_hazard.svg",
    alt: "Slipping hazard",
  },
  {
    id: 20,
    image: "trash_litter.svg",
    alt: "Trash or litter",
  },
  {
    id: 21,
    image: "tripping_hazard.svg",
    alt: "Tripping hazard",
  },
  {
    id: 22,
    image: "uneven_sidewalk.svg",
    alt: "Uneven sidewalk",
  },
  {
    id: 23,
    image: "utility_pole.svg",
    alt: "Utility pole obstructing sidewalk",
  },
  {
    id: 24,
    image: "water.svg",
    alt: "Water",
  },
];

export default TILES;
