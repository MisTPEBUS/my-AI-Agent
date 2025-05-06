"use client";

import { useEffect, useRef, useState } from "react";

interface Prediction {
  description: string;
  place_id: string;
}

interface CustomPlaceAutocompleteProps {
  onSelect: (placeId: string, description: string) => void;
}

export const PlaceAutoComplete = ({
  onSelect,
}: CustomPlaceAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      serviceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  useEffect(() => {
    if (!query || !serviceRef.current) {
      setSuggestions([]);
      return;
    }

    serviceRef.current.getPlacePredictions(
      {
        input: query,
        types: ["(cities)"],
        componentRestrictions: { country: "tw" },
      },
      (predictions, status) => {
        if (status === "OK" && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, [query]);

  const handleSelect = (placeId: string, description: string) => {
    setQuery(description);
    setSuggestions([]);
    onSelect(placeId, description);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder="輸入城市（例如：臺北）"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border rounded  z-10">
          {suggestions.map((sug) => (
            <li
              key={sug.place_id}
              onClick={() => handleSelect(sug.place_id, sug.description)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
            >
              {sug.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
