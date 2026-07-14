import React, {
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChangeEvent } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  FileJson2,
  Link2,
  Loader2,
  MousePointerClick,
  Play,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";

type LottieCategory =
  | "all"
  | "business"
  | "commerce"
  | "communication"
  | "success"
  | "decorative";

type PlaybackMode =
  | "forward"
  | "reverse"
  | "bounce"
  | "reverse-bounce";

type LottieSource = {
  id: string;
  title: string;
  description: string;
  category: Exclude<LottieCategory, "all">;
  keywords: string[];
  data?: string | ArrayBuffer;
  src?: string;
  sourceType: "built-in" | "upload" | "url";
};

type LottieAnimationBrowserProps = {
  editor: any;
  onInserted?: (elementId: string) => void;
  onAddHtml?: (
    html: string,
  ) => string | void | Promise<string | void>;
};

type LayerTransform = {
  position?: unknown;
  anchor?: unknown;
  scale?: unknown;
  rotation?: unknown;
  opacity?: unknown;
};

const CATEGORY_OPTIONS: Array<{
  id: LottieCategory;
  label: string;
}> = [
  { id: "all", label: "הכול" },
  { id: "business", label: "עסקים" },
  { id: "commerce", label: "חנויות" },
  { id: "communication", label: "יצירת קשר" },
  { id: "success", label: "הצלחה" },
  { id: "decorative", label: "דקורטיבי" },
];

const PLAYBACK_OPTIONS: Array<{
  value: PlaybackMode;
  label: string;
}> = [
  { value: "forward", label: "קדימה" },
  { value: "reverse", label: "אחורה" },
  { value: "bounce", label: "קדימה ואחורה" },
  { value: "reverse-bounce", label: "אחורה וקדימה" },
];

const WEB_PLAYER_MODULE_URL =
  "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";

function normalizeSearch(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function hexToLottieColor(hex: string) {
  const clean = hex.replace("#", "").trim();
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : clean.padEnd(6, "0").slice(0, 6);

  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;

  return [red, green, blue, 1];
}

function staticValue<T>(value: T) {
  return {
    a: 0,
    k: value,
  };
}

function animatedValue(
  keyframes: Array<{
    t: number;
    s: number[];
    e?: number[];
  }>,
) {
  return {
    a: 1,
    k: keyframes.map((frame, index) => {
      const next = keyframes[index + 1];

      return {
        t: frame.t,
        s: frame.s,
        ...(frame.e || next?.s
          ? {
              e: frame.e || next?.s,
            }
          : {}),
        ...(next
          ? {
              i: {
                x: 0.667,
                y: 1,
              },
              o: {
                x: 0.333,
                y: 0,
              },
            }
          : {}),
      };
    }),
  };
}

function groupTransform() {
  return {
    ty: "tr",
    p: staticValue([0, 0]),
    a: staticValue([0, 0]),
    s: staticValue([100, 100]),
    r: staticValue(0),
    o: staticValue(100),
    sk: staticValue(0),
    sa: staticValue(0),
    nm: "Transform",
  };
}

function fillShape(color: string, opacity = 100) {
  return {
    ty: "fl",
    c: staticValue(hexToLottieColor(color)),
    o: staticValue(opacity),
    r: 1,
    bm: 0,
    nm: "Fill",
  };
}

function strokeShape(
  color: string,
  width: number,
  opacity = 100,
) {
  return {
    ty: "st",
    c: staticValue(hexToLottieColor(color)),
    o: staticValue(opacity),
    w: staticValue(width),
    lc: 2,
    lj: 2,
    ml: 4,
    bm: 0,
    nm: "Stroke",
  };
}

function ellipseShape(
  width: number,
  height: number,
  position: [number, number] = [0, 0],
) {
  return {
    ty: "el",
    d: 1,
    s: staticValue([width, height]),
    p: staticValue(position),
    nm: "Ellipse",
  };
}

function rectShape(
  width: number,
  height: number,
  radius: number,
  position: [number, number] = [0, 0],
) {
  return {
    ty: "rc",
    d: 1,
    s: staticValue([width, height]),
    p: staticValue(position),
    r: staticValue(radius),
    nm: "Rectangle",
  };
}

function pathShape(
  vertices: Array<[number, number]>,
  closed: boolean,
) {
  const handles = vertices.map(() => [0, 0]);

  return {
    ty: "sh",
    ks: staticValue({
      i: handles,
      o: handles,
      v: vertices,
      c: closed,
    }),
    nm: "Path",
  };
}

function shapeGroup(
  name: string,
  items: Array<Record<string, unknown>>,
) {
  return {
    ty: "gr",
    it: [...items, groupTransform()],
    nm: name,
    np: items.length + 1,
    cix: 2,
    bm: 0,
    ix: 1,
  };
}

function shapeLayer(
  index: number,
  name: string,
  shapes: Array<Record<string, unknown>>,
  transform: LayerTransform = {},
  inPoint = 0,
  outPoint = 120,
) {
  return {
    ddd: 0,
    ind: index,
    ty: 4,
    nm: name,
    sr: 1,
    ks: {
      o: transform.opacity || staticValue(100),
      r: transform.rotation || staticValue(0),
      p: transform.position || staticValue([256, 256, 0]),
      a: transform.anchor || staticValue([0, 0, 0]),
      s: transform.scale || staticValue([100, 100, 100]),
    },
    ao: 0,
    shapes,
    ip: inPoint,
    op: outPoint,
    st: 0,
    bm: 0,
  };
}

function createLottieDocument(
  name: string,
  layers: Array<Record<string, unknown>>,
  frameRate = 60,
  outPoint = 120,
) {
  return JSON.stringify({
    v: "5.12.2",
    fr: frameRate,
    ip: 0,
    op: outPoint,
    w: 512,
    h: 512,
    nm: name,
    ddd: 0,
    assets: [],
    layers,
    markers: [],
  });
}

function buildSuccessAnimation() {
  const circleScale = animatedValue([
    { t: 0, s: [0, 0, 100] },
    { t: 20, s: [112, 112, 100] },
    { t: 32, s: [100, 100, 100] },
    { t: 90, s: [100, 100, 100] },
    { t: 112, s: [0, 0, 100] },
  ]);

  const checkScale = animatedValue([
    { t: 10, s: [55, 55, 100] },
    { t: 30, s: [110, 110, 100] },
    { t: 40, s: [100, 100, 100] },
    { t: 92, s: [100, 100, 100] },
    { t: 112, s: [55, 55, 100] },
  ]);

  const checkOpacity = animatedValue([
    { t: 8, s: [0] },
    { t: 24, s: [100] },
    { t: 96, s: [100] },
    { t: 112, s: [0] },
  ]);

  const layers = [
    shapeLayer(
      1,
      "Success circle",
      [
        shapeGroup("Circle", [
          ellipseShape(272, 272),
          fillShape("#10B981"),
        ]),
      ],
      {
        scale: circleScale,
      },
    ),
    shapeLayer(
      2,
      "Check",
      [
        shapeGroup("Check path", [
          pathShape(
            [
              [-78, 2],
              [-20, 58],
              [92, -68],
            ],
            false,
          ),
          strokeShape("#FFFFFF", 34),
        ]),
      ],
      {
        scale: checkScale,
        opacity: checkOpacity,
      },
    ),
    ...[
      [-178, -92],
      [176, -78],
      [-164, 128],
      [166, 132],
    ].map((position, index) =>
      shapeLayer(
        3 + index,
        `Spark ${index + 1}`,
        [
          shapeGroup("Spark", [
            ellipseShape(24, 24),
            fillShape(index % 2 ? "#F59E0B" : "#7C3AED"),
          ]),
        ],
        {
          position: staticValue([
            256 + position[0],
            256 + position[1],
            0,
          ]),
          scale: animatedValue([
            { t: 10 + index * 4, s: [0, 0, 100] },
            { t: 28 + index * 4, s: [130, 130, 100] },
            { t: 40 + index * 4, s: [100, 100, 100] },
            { t: 94, s: [100, 100, 100] },
            { t: 110, s: [0, 0, 100] },
          ]),
        },
      ),
    ),
  ];

  return createLottieDocument("Bizuply Success", layers);
}

function buildAnalyticsAnimation() {
  const barData = [
    {
      x: -104,
      height: 116,
      color: "#A78BFA",
      delay: 0,
    },
    {
      x: 0,
      height: 190,
      color: "#7C3AED",
      delay: 8,
    },
    {
      x: 104,
      height: 266,
      color: "#2563EB",
      delay: 16,
    },
  ];

  const layers = [
    shapeLayer(1, "Soft card", [
      shapeGroup("Card", [
        rectShape(390, 342, 48),
        fillShape("#F5F3FF"),
      ]),
    ]),
    ...barData.map((bar, index) =>
      shapeLayer(
        2 + index,
        `Bar ${index + 1}`,
        [
          shapeGroup("Bar", [
            rectShape(72, bar.height, 28),
            fillShape(bar.color),
          ]),
        ],
        {
          position: staticValue([
            256 + bar.x,
            330 - bar.height / 2,
            0,
          ]),
          scale: animatedValue([
            {
              t: bar.delay,
              s: [100, 0, 100],
            },
            {
              t: 28 + bar.delay,
              s: [100, 112, 100],
            },
            {
              t: 38 + bar.delay,
              s: [100, 100, 100],
            },
            {
              t: 92,
              s: [100, 100, 100],
            },
            {
              t: 116,
              s: [100, 0, 100],
            },
          ]),
        },
      ),
    ),
    shapeLayer(
      6,
      "Growth line",
      [
        shapeGroup("Growth path", [
          pathShape(
            [
              [-138, 52],
              [-42, 4],
              [42, -50],
              [136, -130],
            ],
            false,
          ),
          strokeShape("#111827", 18),
        ]),
      ],
      {
        opacity: animatedValue([
          { t: 26, s: [0] },
          { t: 48, s: [100] },
          { t: 94, s: [100] },
          { t: 116, s: [0] },
        ]),
        scale: animatedValue([
          { t: 24, s: [72, 72, 100] },
          { t: 50, s: [100, 100, 100] },
          { t: 96, s: [100, 100, 100] },
          { t: 116, s: [72, 72, 100] },
        ]),
      },
    ),
  ];

  return createLottieDocument("Bizuply Analytics", layers);
}

function buildMessagesAnimation() {
  const bubbleMotionLeft = animatedValue([
    { t: 0, s: [82, 284, 0] },
    { t: 26, s: [192, 246, 0] },
    { t: 72, s: [188, 238, 0] },
    { t: 112, s: [82, 284, 0] },
  ]);

  const bubbleMotionRight = animatedValue([
    { t: 10, s: [430, 194, 0] },
    { t: 34, s: [320, 202, 0] },
    { t: 78, s: [324, 212, 0] },
    { t: 116, s: [430, 194, 0] },
  ]);

  const bubble = (
    index: number,
    name: string,
    color: string,
    position: unknown,
    tailDirection: "left" | "right",
  ) =>
    shapeLayer(
      index,
      name,
      [
        shapeGroup("Bubble", [
          rectShape(248, 142, 42),
          fillShape(color),
        ]),
        shapeGroup("Tail", [
          pathShape(
            tailDirection === "left"
              ? [
                  [-80, 58],
                  [-112, 104],
                  [-32, 68],
                ]
              : [
                  [80, 58],
                  [112, 104],
                  [32, 68],
                ],
            true,
          ),
          fillShape(color),
        ]),
      ],
      {
        position,
        scale: animatedValue([
          { t: 0, s: [88, 88, 100] },
          { t: 28, s: [104, 104, 100] },
          { t: 40, s: [100, 100, 100] },
          { t: 90, s: [100, 100, 100] },
          { t: 116, s: [88, 88, 100] },
        ]),
      },
    );

  const layers = [
    bubble(
      1,
      "Purple message",
      "#7C3AED",
      bubbleMotionLeft,
      "left",
    ),
    bubble(
      2,
      "Blue message",
      "#2563EB",
      bubbleMotionRight,
      "right",
    ),
    ...[-52, 0, 52].map((x, index) =>
      shapeLayer(
        3 + index,
        `Dot ${index + 1}`,
        [
          shapeGroup("Dot", [
            ellipseShape(22, 22),
            fillShape("#FFFFFF"),
          ]),
        ],
        {
          position: staticValue([192 + x, 246, 0]),
          scale: animatedValue([
            { t: 24 + index * 6, s: [50, 50, 100] },
            { t: 40 + index * 6, s: [125, 125, 100] },
            { t: 54 + index * 6, s: [100, 100, 100] },
            { t: 86, s: [100, 100, 100] },
            { t: 108, s: [50, 50, 100] },
          ]),
        },
      ),
    ),
  ];

  return createLottieDocument("Bizuply Messages", layers);
}

function buildRocketAnimation() {
  const rocketPosition = animatedValue([
    { t: 0, s: [256, 344, 0] },
    { t: 26, s: [246, 234, 0] },
    { t: 54, s: [264, 214, 0] },
    { t: 82, s: [248, 238, 0] },
    { t: 116, s: [256, 344, 0] },
  ]);

  const rocketRotation = animatedValue([
    { t: 0, s: [-7] },
    { t: 30, s: [5] },
    { t: 58, s: [-4] },
    { t: 86, s: [4] },
    { t: 116, s: [-7] },
  ]);

  const flameScale = animatedValue([
    { t: 0, s: [78, 72, 100] },
    { t: 12, s: [94, 126, 100] },
    { t: 24, s: [82, 86, 100] },
    { t: 40, s: [100, 140, 100] },
    { t: 58, s: [86, 76, 100] },
    { t: 76, s: [96, 132, 100] },
    { t: 96, s: [82, 88, 100] },
    { t: 116, s: [78, 72, 100] },
  ]);

  const layers = [
    shapeLayer(
      1,
      "Rocket",
      [
        shapeGroup("Body", [
          rectShape(112, 224, 58),
          fillShape("#F8FAFC"),
          strokeShape("#111827", 10),
        ]),
        shapeGroup("Window", [
          ellipseShape(56, 56, [0, -40]),
          fillShape("#38BDF8"),
          strokeShape("#111827", 9),
        ]),
        shapeGroup("Left fin", [
          pathShape(
            [
              [-54, 44],
              [-110, 112],
              [-48, 98],
            ],
            true,
          ),
          fillShape("#7C3AED"),
          strokeShape("#111827", 8),
        ]),
        shapeGroup("Right fin", [
          pathShape(
            [
              [54, 44],
              [110, 112],
              [48, 98],
            ],
            true,
          ),
          fillShape("#7C3AED"),
          strokeShape("#111827", 8),
        ]),
        shapeGroup("Nose", [
          pathShape(
            [
              [-48, -96],
              [0, -162],
              [48, -96],
            ],
            true,
          ),
          fillShape("#F43F5E"),
          strokeShape("#111827", 8),
        ]),
      ],
      {
        position: rocketPosition,
        rotation: rocketRotation,
      },
    ),
    shapeLayer(
      2,
      "Flame",
      [
        shapeGroup("Flame", [
          pathShape(
            [
              [-34, -34],
              [0, 88],
              [34, -34],
            ],
            true,
          ),
          fillShape("#F59E0B"),
        ]),
        shapeGroup("Inner flame", [
          pathShape(
            [
              [-16, -24],
              [0, 52],
              [16, -24],
            ],
            true,
          ),
          fillShape("#FDE047"),
        ]),
      ],
      {
        position: animatedValue([
          { t: 0, s: [256, 460, 0] },
          { t: 26, s: [246, 350, 0] },
          { t: 54, s: [264, 330, 0] },
          { t: 82, s: [248, 354, 0] },
          { t: 116, s: [256, 460, 0] },
        ]),
        scale: flameScale,
      },
    ),
    ...[-120, 0, 120].map((x, index) =>
      shapeLayer(
        3 + index,
        `Cloud ${index + 1}`,
        [
          shapeGroup("Cloud", [
            ellipseShape(110, 42),
            fillShape("#E2E8F0", 92),
          ]),
        ],
        {
          position: animatedValue([
            {
              t: index * 7,
              s: [256 + x, 444, 0],
            },
            {
              t: 48 + index * 7,
              s: [256 + x * 1.4, 488, 0],
            },
            {
              t: 116,
              s: [256 + x, 444, 0],
            },
          ]),
          opacity: animatedValue([
            { t: 0, s: [0] },
            { t: 18 + index * 5, s: [100] },
            { t: 90, s: [100] },
            { t: 116, s: [0] },
          ]),
        },
      ),
    ),
  ];

  return createLottieDocument("Bizuply Rocket", layers);
}

function buildCommerceAnimation() {
  const bagScale = animatedValue([
    { t: 0, s: [82, 82, 100] },
    { t: 20, s: [108, 108, 100] },
    { t: 34, s: [100, 100, 100] },
    { t: 72, s: [104, 104, 100] },
    { t: 88, s: [100, 100, 100] },
    { t: 116, s: [82, 82, 100] },
  ]);

  const bagPosition = animatedValue([
    { t: 0, s: [256, 290, 0] },
    { t: 22, s: [256, 246, 0] },
    { t: 38, s: [256, 260, 0] },
    { t: 74, s: [256, 246, 0] },
    { t: 90, s: [256, 260, 0] },
    { t: 116, s: [256, 290, 0] },
  ]);

  const layers = [
    shapeLayer(
      1,
      "Shopping bag",
      [
        shapeGroup("Bag", [
          rectShape(266, 254, 44, [0, 36]),
          fillShape("#7C3AED"),
        ]),
        shapeGroup("Handle", [
          pathShape(
            [
              [-76, -72],
              [-68, -140],
              [0, -170],
              [68, -140],
              [76, -72],
            ],
            false,
          ),
          strokeShape("#111827", 24),
        ]),
        shapeGroup("Smile", [
          pathShape(
            [
              [-54, 34],
              [0, 66],
              [54, 34],
            ],
            false,
          ),
          strokeShape("#FFFFFF", 18),
        ]),
      ],
      {
        position: bagPosition,
        scale: bagScale,
        rotation: animatedValue([
          { t: 0, s: [-4] },
          { t: 30, s: [4] },
          { t: 60, s: [-3] },
          { t: 88, s: [3] },
          { t: 116, s: [-4] },
        ]),
      },
    ),
    ...[
      [-170, -118, "#F59E0B"],
      [164, -104, "#38BDF8"],
      [-154, 142, "#10B981"],
      [166, 146, "#F43F5E"],
    ].map(([x, y, color], index) =>
      shapeLayer(
        2 + index,
        `Commerce spark ${index + 1}`,
        [
          shapeGroup("Spark", [
            pathShape(
              [
                [0, -24],
                [8, -8],
                [24, 0],
                [8, 8],
                [0, 24],
                [-8, 8],
                [-24, 0],
                [-8, -8],
              ],
              true,
            ),
            fillShape(String(color)),
          ]),
        ],
        {
          position: staticValue([
            256 + Number(x),
            256 + Number(y),
            0,
          ]),
          scale: animatedValue([
            { t: index * 8, s: [0, 0, 100] },
            { t: 26 + index * 8, s: [125, 125, 100] },
            { t: 42 + index * 8, s: [100, 100, 100] },
            { t: 92, s: [100, 100, 100] },
            { t: 116, s: [0, 0, 100] },
          ]),
          rotation: animatedValue([
            { t: 0, s: [0] },
            { t: 116, s: [180] },
          ]),
        },
      ),
    ),
  ];

  return createLottieDocument("Bizuply Commerce", layers);
}

function buildTargetAnimation() {
  const ring = (
    index: number,
    size: number,
    color: string,
    delay: number,
  ) =>
    shapeLayer(
      index,
      `Ring ${index}`,
      [
        shapeGroup("Ring", [
          ellipseShape(size, size),
          strokeShape(color, 22),
        ]),
      ],
      {
        scale: animatedValue([
          { t: delay, s: [70, 70, 100] },
          { t: 32 + delay, s: [108, 108, 100] },
          { t: 58 + delay, s: [100, 100, 100] },
          { t: 92, s: [100, 100, 100] },
          { t: 116, s: [70, 70, 100] },
        ]),
        opacity: animatedValue([
          { t: delay, s: [0] },
          { t: 22 + delay, s: [100] },
          { t: 92, s: [100] },
          { t: 116, s: [0] },
        ]),
      },
    );

  const layers = [
    ring(1, 336, "#C4B5FD", 0),
    ring(2, 236, "#8B5CF6", 8),
    ring(3, 142, "#6D28D9", 16),
    shapeLayer(
      4,
      "Target center",
      [
        shapeGroup("Center", [
          ellipseShape(72, 72),
          fillShape("#F43F5E"),
        ]),
      ],
      {
        scale: animatedValue([
          { t: 16, s: [0, 0, 100] },
          { t: 38, s: [132, 132, 100] },
          { t: 52, s: [100, 100, 100] },
          { t: 90, s: [100, 100, 100] },
          { t: 116, s: [0, 0, 100] },
        ]),
      },
    ),
    shapeLayer(
      5,
      "Arrow",
      [
        shapeGroup("Arrow line", [
          pathShape(
            [
              [-150, 142],
              [0, 0],
            ],
            false,
          ),
          strokeShape("#111827", 20),
        ]),
        shapeGroup("Arrow head", [
          pathShape(
            [
              [-14, -44],
              [36, 0],
              [-14, 44],
            ],
            false,
          ),
          strokeShape("#111827", 20),
        ]),
      ],
      {
        position: animatedValue([
          { t: 0, s: [94, 418, 0] },
          { t: 42, s: [256, 256, 0] },
          { t: 92, s: [256, 256, 0] },
          { t: 116, s: [94, 418, 0] },
        ]),
        opacity: animatedValue([
          { t: 0, s: [0] },
          { t: 18, s: [100] },
          { t: 96, s: [100] },
          { t: 116, s: [0] },
        ]),
      },
    ),
  ];

  return createLottieDocument("Bizuply Target", layers);
}

const STARTER_ANIMATIONS: LottieSource[] = [
  {
    id: "success-check",
    title: "הצלחה מקצועית",
    description: "סימון הצלחה עם ניצוצות ורקע שקוף",
    category: "success",
    keywords: [
      "success",
      "check",
      "done",
      "approved",
      "הצלחה",
      "אישור",
      "וי",
    ],
    data: buildSuccessAnimation(),
    sourceType: "built-in",
  },
  {
    id: "analytics-growth",
    title: "צמיחה ונתונים",
    description: "גרף עסקי עם עמודות וקו צמיחה",
    category: "business",
    keywords: [
      "analytics",
      "growth",
      "chart",
      "business",
      "נתונים",
      "צמיחה",
      "גרף",
    ],
    data: buildAnalyticsAnimation(),
    sourceType: "built-in",
  },
  {
    id: "messages-flow",
    title: "שיחה והודעות",
    description: "בועות שיחה מודרניות בתנועה חלקה",
    category: "communication",
    keywords: [
      "messages",
      "chat",
      "contact",
      "conversation",
      "הודעות",
      "שיחה",
      "צור קשר",
    ],
    data: buildMessagesAnimation(),
    sourceType: "built-in",
  },
  {
    id: "rocket-launch",
    title: "השקה וצמיחה",
    description: "רקטה מונפשת להשקות ועמודי מוצר",
    category: "business",
    keywords: [
      "rocket",
      "launch",
      "startup",
      "growth",
      "רקטה",
      "השקה",
      "סטארטאפ",
    ],
    data: buildRocketAnimation(),
    sourceType: "built-in",
  },
  {
    id: "commerce-bag",
    title: "חנות ומכירות",
    description: "שקית קניות עם תנועה וניצוצות",
    category: "commerce",
    keywords: [
      "shop",
      "commerce",
      "shopping",
      "sales",
      "חנות",
      "קניות",
      "מכירות",
    ],
    data: buildCommerceAnimation(),
    sourceType: "built-in",
  },
  {
    id: "target-focus",
    title: "מטרה ומיקוד",
    description: "מטרה עם טבעות וחץ בתנועה",
    category: "decorative",
    keywords: [
      "target",
      "focus",
      "goal",
      "marketing",
      "מטרה",
      "מיקוד",
      "שיווק",
    ],
    data: buildTargetAnimation(),
    sourceType: "built-in",
  },
];

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function textToJsonDataUrl(value: string) {
  return `data:application/json;charset=utf-8,${encodeURIComponent(
    value,
  )}`;
}

function arrayBufferToDataUrl(
  value: ArrayBuffer,
  mimeType = "application/octet-stream",
) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    const blob = new Blob([value], {
      type: mimeType,
    });

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("לא ניתן היה לקרוא את קובץ האנימציה"));
    };

    reader.onerror = () => {
      reject(
        reader.error ||
          new Error("לא ניתן היה לקרוא את קובץ האנימציה"),
      );
    };

    reader.readAsDataURL(blob);
  });
}

function extractElementId(result: unknown) {
  if (typeof result === "string") return result;

  if (result && typeof result === "object") {
    const record = result as Record<string, unknown>;
    const possibleId =
      record.id ||
      record.elementId ||
      record.element_id ||
      record._id;

    if (typeof possibleId === "string") {
      return possibleId;
    }
  }

  return "";
}

function buildLottieIframeHtml({
  title,
  src,
  autoplay,
  loop,
  playOnHover,
  speed,
  mode,
  size,
}: {
  title: string;
  src: string;
  autoplay: boolean;
  loop: boolean;
  playOnHover: boolean;
  speed: number;
  mode: PlaybackMode;
  size: number;
}) {
  const documentHtml = `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
      background: transparent;
    }

    body {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
      background: transparent;
    }
  </style>
</head>
<body>
  <canvas id="bizuply-lottie-canvas"></canvas>
  <script type="module">
    import { DotLottie } from ${JSON.stringify(WEB_PLAYER_MODULE_URL)};

    const canvas = document.getElementById("bizuply-lottie-canvas");
    const player = new DotLottie({
      canvas,
      src: ${JSON.stringify(src)},
      autoplay: ${JSON.stringify(autoplay && !playOnHover)},
      loop: ${JSON.stringify(loop)},
      speed: ${JSON.stringify(speed)},
      mode: ${JSON.stringify(mode)},
      backgroundColor: "#00000000",
      renderConfig: {
        autoResize: true,
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      },
      layout: {
        fit: "contain",
        align: [0.5, 0.5],
      },
    });

    if (${JSON.stringify(playOnHover)}) {
      document.body.addEventListener("mouseenter", () => {
        player.play();
      });

      document.body.addEventListener("mouseleave", () => {
        player.pause();
        player.setFrame(0);
      });
    }
  <\/script>
</body>
</html>`;

  return `<div
  data-bizuply-lottie="true"
  data-bizuply-lottie-title="${escapeHtmlAttribute(title)}"
  style="width:${size}px;height:${size}px;max-width:100%;background:transparent;border:0;border-radius:0;padding:0;overflow:visible;"
>
  <iframe
    title="${escapeHtmlAttribute(title)}"
    srcdoc="${escapeHtmlAttribute(documentHtml)}"
    loading="lazy"
    allow="autoplay"
    style="display:block;width:100%;height:100%;border:0;background:transparent;overflow:hidden;"
  ></iframe>
</div>`;
}

async function insertHtmlIntoEditor({
  editor,
  onAddHtml,
  html,
  size,
  metadata,
}: {
  editor: any;
  onAddHtml?: LottieAnimationBrowserProps["onAddHtml"];
  html: string;
  size: number;
  metadata: Record<string, unknown>;
}) {
  if (typeof onAddHtml === "function") {
    const result = await onAddHtml(html);
    return extractElementId(result);
  }

  if (typeof editor?.addHtml === "function") {
    const result = await editor.addHtml(html, metadata);
    return extractElementId(result);
  }

  if (typeof editor?.addRawHtml === "function") {
    const result = await editor.addRawHtml(html, metadata);
    return extractElementId(result);
  }

  if (typeof editor?.insertHtml === "function") {
    const result = await editor.insertHtml(html, metadata);
    return extractElementId(result);
  }

  if (typeof editor?.addElement !== "function") {
    throw new Error(
      "לא נמצאה בעורך פונקציה להוספת HTML. צריך לחבר onAddHtml או editor.addHtml.",
    );
  }

  const created = await editor.addElement("html");
  const elementId = extractElementId(created) || String(created || "");

  if (!elementId) {
    throw new Error("לא ניתן היה ליצור אלמנט HTML בקנבס");
  }

  let contentUpdated = false;

  if (typeof editor?.updateHtml === "function") {
    editor.updateHtml(elementId, {
      html,
      content: html,
      code: html,
      ...metadata,
    });
    contentUpdated = true;
  }

  if (typeof editor?.updateElement === "function") {
    editor.updateElement(elementId, {
      type: "html",
      html,
      content: html,
      code: html,
      ...metadata,
    });
    contentUpdated = true;
  }

  if (typeof editor?.updateContent === "function") {
    editor.updateContent(elementId, html);
    contentUpdated = true;
  }

  if (!contentUpdated) {
    editor.updateAttributes?.(elementId, {
      "data-bizuply-html": html,
      "data-bizuply-lottie": "true",
    });
  }

  editor.applyStyle?.(elementId, {
    display: "block",
    width: `${size}px`,
    height: `${size}px`,
    maxWidth: "100%",
    background: "transparent",
    backgroundColor: "transparent",
    border: "0",
    borderRadius: "0px",
    padding: "0px",
    margin: "0px",
    boxShadow: "none",
    overflow: "visible",
  });

  editor.applyLayout?.(elementId, {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: "80px",
    minHeight: "80px",
  });

  editor.updateAttributes?.(elementId, {
    "data-bizuply-lottie": "true",
    "data-bizuply-lottie-source": String(
      metadata.lottieSource || "",
    ),
    "data-bizuply-lottie-loop": String(
      metadata.lottieLoop || false,
    ),
    "data-bizuply-lottie-autoplay": String(
      metadata.lottieAutoplay || false,
    ),
    "data-bizuply-lottie-speed": String(
      metadata.lottieSpeed || 1,
    ),
    "data-bizuply-lottie-mode": String(
      metadata.lottieMode || "forward",
    ),
  });

  editor.applyDataToDom?.();
  return elementId;
}

function LottiePreview({
  animation,
  autoplay,
  loop,
  playOnHover,
  speed,
  mode,
}: {
  animation: LottieSource;
  autoplay: boolean;
  loop: boolean;
  playOnHover: boolean;
  speed: number;
  mode: PlaybackMode;
}) {
  const sharedProps = {
    autoplay: autoplay && !playOnHover,
    loop,
    playOnHover,
    speed,
    mode,
    backgroundColor: "#00000000",
    renderConfig: {
      autoResize: true,
      devicePixelRatio:
        typeof window === "undefined"
          ? 1
          : Math.min(window.devicePixelRatio || 1, 2),
    },
    style: {
      width: "100%",
      height: "100%",
      display: "block",
      background: "transparent",
    },
  };

  if (animation.data !== undefined) {
    return (
      <DotLottieReact
        {...sharedProps}
        data={animation.data}
      />
    );
  }

  return (
    <DotLottieReact
      {...sharedProps}
      src={animation.src}
    />
  );
}

export default function LottieAnimationBrowser({
  editor,
  onInserted,
  onAddHtml,
}: LottieAnimationBrowserProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [customAnimations, setCustomAnimations] = useState<
    LottieSource[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] =
    useState<LottieCategory>("all");
  const [autoplay, setAutoplay] = useState(true);
  const [loop, setLoop] = useState(true);
  const [playOnHover, setPlayOnHover] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [mode, setMode] =
    useState<PlaybackMode>("forward");
  const [size, setSize] = useState(320);
  const [urlInput, setUrlInput] = useState("");
  const [addingId, setAddingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const allAnimations = useMemo(
    () => [...customAnimations, ...STARTER_ANIMATIONS],
    [customAnimations],
  );

  const filteredAnimations = useMemo(() => {
    const query = normalizeSearch(searchQuery);

    return allAnimations.filter((animation) => {
      const matchesCategory =
        category === "all" ||
        animation.category === category;

      if (!matchesCategory) return false;
      if (!query) return true;

      const searchable = normalizeSearch(
        `${animation.title} ${animation.description} ${animation.keywords.join(
          " ",
        )}`,
      );

      return query
        .split(" ")
        .filter(Boolean)
        .every((word) => searchable.includes(word));
    });
  }, [allAnimations, category, searchQuery]);

  const handleUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    setError("");
    setSuccess("");

    const nextItems: LottieSource[] = [];

    for (const file of files) {
      const lowerName = file.name.toLowerCase();
      const isJson = lowerName.endsWith(".json");
      const isDotLottie = lowerName.endsWith(".lottie");

      if (!isJson && !isDotLottie) {
        setError(
          `הקובץ ${file.name} אינו קובץ JSON או Lottie תקין`,
        );
        continue;
      }

      if (file.size > 4 * 1024 * 1024) {
        setError(
          `הקובץ ${file.name} גדול מדי. הגודל המרבי הוא 4MB`,
        );
        continue;
      }

      if (isJson) {
        const text = await file.text();

        try {
          JSON.parse(text);
        } catch {
          setError(`קובץ ה־JSON ${file.name} אינו תקין`);
          continue;
        }

        nextItems.push({
          id: `upload-${Date.now()}-${nextItems.length}`,
          title: file.name.replace(/\.json$/i, ""),
          description: "אנימציה שהועלתה מהמחשב",
          category: "decorative",
          keywords: [file.name, "upload", "העלאה"],
          data: text,
          sourceType: "upload",
        });
        continue;
      }

      const buffer = await file.arrayBuffer();
      nextItems.push({
        id: `upload-${Date.now()}-${nextItems.length}`,
        title: file.name.replace(/\.lottie$/i, ""),
        description: "קובץ dotLottie שהועלה מהמחשב",
        category: "decorative",
        keywords: [file.name, "dotlottie", "upload", "העלאה"],
        data: buffer,
        sourceType: "upload",
      });
    }

    if (nextItems.length) {
      setCustomAnimations((current) => [
        ...nextItems,
        ...current,
      ]);
      setSuccess(
        `${nextItems.length} אנימציות נוספו למאגר המקומי`,
      );
    }
  };

  const addUrlAnimation = () => {
    const trimmed = urlInput.trim();

    if (!trimmed) {
      setError("הדביקו קישור לקובץ JSON או Lottie");
      return;
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(trimmed);
    } catch {
      setError("הקישור שהוזן אינו תקין");
      return;
    }

    if (!/^https?:$/.test(parsedUrl.protocol)) {
      setError("אפשר להוסיף רק קישור HTTP או HTTPS");
      return;
    }

    const fileName =
      parsedUrl.pathname.split("/").filter(Boolean).pop() ||
      "Lottie animation";

    setCustomAnimations((current) => [
      {
        id: `url-${Date.now()}`,
        title: fileName.replace(/\.(json|lottie)$/i, ""),
        description: "אנימציה מקישור חיצוני",
        category: "decorative",
        keywords: [fileName, "url", "link", "קישור"],
        src: trimmed,
        sourceType: "url",
      },
      ...current,
    ]);

    setUrlInput("");
    setError("");
    setSuccess("האנימציה מהקישור נוספה לתצוגה");
  };

  const getPersistentSource = async (
    animation: LottieSource,
  ) => {
    if (animation.src) return animation.src;

    if (typeof animation.data === "string") {
      return textToJsonDataUrl(animation.data);
    }

    if (animation.data instanceof ArrayBuffer) {
      return arrayBufferToDataUrl(
        animation.data,
        "application/octet-stream",
      );
    }

    throw new Error("לא נמצא מקור תקין לאנימציה");
  };

  const addAnimationToCanvas = async (
    animation: LottieSource,
  ) => {
    setAddingId(animation.id);
    setError("");
    setSuccess("");

    try {
      const persistentSource = await getPersistentSource(
        animation,
      );

      const html = buildLottieIframeHtml({
        title: animation.title,
        src: persistentSource,
        autoplay,
        loop,
        playOnHover,
        speed,
        mode,
        size,
      });

      const metadata = {
        provider: "bizuply-lottie",
        mediaType: "lottie",
        lottieSource: persistentSource,
        lottieTitle: animation.title,
        lottieAutoplay: autoplay,
        lottieLoop: loop,
        lottiePlayOnHover: playOnHover,
        lottieSpeed: speed,
        lottieMode: mode,
        lottieSize: size,
        html,
      };

      const elementId = await insertHtmlIntoEditor({
        editor,
        onAddHtml,
        html,
        size,
        metadata,
      });

      editor?.applyDataToDom?.();
      onInserted?.(elementId);
      setSuccess(`${animation.title} נוספה לעמוד`);
    } catch (caughtError) {
      console.error(
        "[Bizuply Lottie] add animation failed",
        caughtError,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "הוספת האנימציה נכשלה",
      );
    } finally {
      setAddingId("");
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f7f8fb]">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.lottie,application/json,application/octet-stream"
        multiple
        className="hidden"
        onChange={handleUpload}
      />

      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="חיפוש אנימציה בעברית או באנגלית..."
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-violet-700"
          >
            <Upload className="h-4 w-4" />
            העלאת JSON / Lottie
          </button>
        </div>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <label className="flex h-11 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
            <Link2 className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              dir="ltr"
              type="url"
              value={urlInput}
              onChange={(event) =>
                setUrlInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addUrlAnimation();
                }
              }}
              placeholder="https://.../animation.lottie"
              className="min-w-0 flex-1 bg-transparent text-left text-xs font-bold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>

          <button
            type="button"
            onClick={addUrlAnimation}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 px-5 text-xs font-black text-violet-700 transition hover:bg-violet-100"
          >
            הוספה מקישור
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {CATEGORY_OPTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={[
                "whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition",
                category === item.id
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <label className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2">
            <span className="text-xs font-black text-slate-700">
              הפעלה אוטומטית
            </span>
            <input
              type="checkbox"
              checked={autoplay}
              disabled={playOnHover}
              onChange={(event) =>
                setAutoplay(event.target.checked)
              }
              className="h-4 w-4 accent-violet-600"
            />
          </label>

          <label className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2">
            <span className="text-xs font-black text-slate-700">
              לולאה
            </span>
            <input
              type="checkbox"
              checked={loop}
              onChange={(event) =>
                setLoop(event.target.checked)
              }
              className="h-4 w-4 accent-violet-600"
            />
          </label>

          <label className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2">
            <span className="text-xs font-black text-slate-700">
              הפעלה ב־Hover
            </span>
            <input
              type="checkbox"
              checked={playOnHover}
              onChange={(event) => {
                const checked = event.target.checked;
                setPlayOnHover(checked);

                if (checked) {
                  setAutoplay(false);
                }
              }}
              className="h-4 w-4 accent-violet-600"
            />
          </label>

          <label className="relative rounded-xl bg-white px-3 py-2">
            <span className="mb-1 block text-[10px] font-black text-slate-500">
              מצב ניגון
            </span>
            <select
              value={mode}
              onChange={(event) =>
                setMode(event.target.value as PlaybackMode)
              }
              className="w-full appearance-none bg-transparent pl-6 text-xs font-black text-slate-800 outline-none"
            >
              {PLAYBACK_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute bottom-3 left-3 h-3.5 w-3.5 text-slate-400" />
          </label>

          <label className="col-span-2 flex items-center gap-3 rounded-xl bg-white px-3 py-2">
            <span className="whitespace-nowrap text-xs font-black text-slate-700">
              מהירות: {speed.toFixed(1)}×
            </span>
            <input
              type="range"
              min={0.25}
              max={3}
              step={0.25}
              value={speed}
              onChange={(event) =>
                setSpeed(Number(event.target.value))
              }
              className="min-w-0 flex-1 accent-violet-600"
            />
          </label>

          <label className="col-span-2 flex items-center gap-3 rounded-xl bg-white px-3 py-2">
            <span className="whitespace-nowrap text-xs font-black text-slate-700">
              גודל: {size}px
            </span>
            <input
              type="range"
              min={120}
              max={640}
              step={20}
              value={size}
              onChange={(event) =>
                setSize(Number(event.target.value))
              }
              className="min-w-0 flex-1 accent-violet-600"
            />
          </label>
        </div>

        {error ? (
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold leading-5 text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            {success}
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-violet-600" />
            <p className="truncate text-xs font-bold text-slate-500">
              אנימציות Lottie וקטוריות עם רקע שקוף
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm">
            {filteredAnimations.length} אנימציות
          </span>
        </div>

        {filteredAnimations.length ? (
          <div className="grid grid-cols-3 gap-5">
            {filteredAnimations.map((animation) => {
              const isAdding = addingId === animation.id;

              return (
                <article
                  key={animation.id}
                  className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_20px_45px_rgba(91,33,182,0.12)]"
                >
                  <div className="relative h-[220px] overflow-hidden border-b border-slate-100 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#f8fafc_68%,_#f1f5f9_100%)]">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(148,163,184,0.06)_25%,transparent_25%),linear-gradient(-45deg,rgba(148,163,184,0.06)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(148,163,184,0.06)_75%),linear-gradient(-45deg,transparent_75%,rgba(148,163,184,0.06)_75%)] bg-[length:22px_22px] bg-[position:0_0,0_11px,11px_-11px,-11px_0px]" />

                    <div className="relative flex h-full items-center justify-center p-4">
                      <div className="h-full w-full max-w-[210px]">
                        <LottiePreview
                          animation={animation}
                          autoplay={autoplay}
                          loop={loop}
                          playOnHover={playOnHover}
                          speed={speed}
                          mode={mode}
                        />
                      </div>
                    </div>

                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-slate-600 shadow-sm backdrop-blur">
                      {animation.sourceType === "built-in"
                        ? "Bizuply"
                        : animation.sourceType === "upload"
                          ? "העלאה"
                          : "קישור"}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-black text-slate-950">
                      {animation.title}
                    </h3>
                    <p className="mt-1 min-h-10 text-xs font-bold leading-5 text-slate-400">
                      {animation.description}
                    </p>

                    <button
                      type="button"
                      disabled={Boolean(addingId)}
                      onClick={() =>
                        void addAnimationToCanvas(animation)
                      }
                      className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 text-xs font-black text-white transition hover:bg-violet-700 disabled:cursor-wait disabled:opacity-70"
                    >
                      {isAdding ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : playOnHover ? (
                        <MousePointerClick className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      {isAdding
                        ? "מוסיף לעמוד..."
                        : "הוספה לעמוד"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-200 bg-white px-8 text-center">
            <FileJson2 className="h-11 w-11 text-slate-300" />
            <h3 className="mt-4 text-base font-black text-slate-900">
              לא נמצאו אנימציות
            </h3>
            <p className="mt-2 text-sm font-bold text-slate-400">
              נסו חיפוש אחר, עברו לקטגוריית הכול או העלו קובץ
              JSON / Lottie
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
