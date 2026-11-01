import { createContext, useContext } from "react";

export type Film = {
  src: string;
  poster: string;
  title: string;
  caption: string;
  tag: string;
};

const FilmContext = createContext<(film: Film) => void>(() => {});

export const FilmProvider = FilmContext.Provider;

export function useOpenFilm() {
  return useContext(FilmContext);
}
