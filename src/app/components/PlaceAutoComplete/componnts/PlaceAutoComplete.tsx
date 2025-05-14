"use client";

import { useEffect, useRef, useState } from "react";

interface Prediction {
  description: string;
  place_id: string;
}

interface PlaceAutoCompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (placeId: string, description: string) => void;
}

export const PlaceAutoComplete = ({
  value,
  onChange,
  onSelect,
}: PlaceAutoCompleteProps) => {
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      serviceRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  useEffect(() => {
    if (!value || !serviceRef.current) {
      setSuggestions([]);
      return;
    }

    serviceRef.current.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: "tw" },
      },
      (predictions) => {
        setSuggestions(predictions || []);
      }
    );
  }, [value]);

  const handleSelect = (placeId: string, description: string) => {
    onSelect(placeId, description);
    onChange(""); // 清除輸入
    setSuggestions([]); // 清除建議
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="請輸入目的地（例如：南 港 展 覽 館）"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bottom-full mb-1 left-0 right-0 bg-white border rounded z-10 max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((sug, index) => (
            <li
              key={sug.place_id || index}
              onClick={() => {
                handleSelect(sug.place_id, sug.description);
              }}
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
