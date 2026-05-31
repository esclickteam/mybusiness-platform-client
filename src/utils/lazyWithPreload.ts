import React from "react";

export type PreloadableComponent<T extends React.ComponentType<any>> =
  React.LazyExoticComponent<T> & {
    preload: () => Promise<{ default: T }>;
  };

export function lazyWithPreload<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): PreloadableComponent<T> {
  const Component = React.lazy(factory) as PreloadableComponent<T>;
  Component.preload = factory;
  return Component;
}