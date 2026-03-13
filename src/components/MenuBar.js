import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { NOTE_PATHS, REST_PATHS, ACCIDENTAL_PATHS } from "../constants/svgPaths";
import { TIME_SIGNATURES } from "../constants/music";

const KEYBOARD_ICON_PATHS = [
  "M113.5332,34.25 C112.55295,34.25 111.74609,35.056852 111.74609,36.037109 L111.74609,41.990234 C111.74609,42.970492 112.55295,43.775391 113.5332,43.775391 L120.54297,43.775391 C121.52323,43.775391 122.33008,42.970492 122.33008,41.990234 L122.33008,36.037109 C122.33008,35.056852 121.52323,34.25 120.54297,34.25 L113.5332,34.25 Z M113.5332,35.308594 L120.54297,35.308594 C120.95523,35.308594 121.27148,35.624866 121.27148,36.037109 L121.27148,41.990234 C121.27148,42.402478 120.95523,42.716797 120.54297,42.716797 L113.5332,42.716797 C113.12096,42.716797 112.80469,42.402478 112.80469,41.990234 L112.80469,36.037109 C112.80469,35.624866 113.12096,35.308594 113.5332,35.308594 Z",
  "M113.86274,36.36742 L114.39192,36.36742 C114.53848,36.36742 114.65647,36.485411 114.65647,36.631973 L114.65647,37.161145 C114.65647,37.307707 114.53848,37.425698 114.39192,37.425698 L113.86274,37.425698 C113.71618,37.425698 113.59819,37.307707 113.59819,37.161145 L113.59819,36.631973 C113.59819,36.485411 113.71618,36.36742 113.86274,36.36742 Z",
  "M115.80302,36.36742 L116.33219,36.36742 C116.47875,36.36742 116.59675,36.485411 116.59675,36.631973 L116.59675,37.161145 C116.59675,37.307707 116.47875,37.425698 116.33219,37.425698 L115.80302,37.425698 C115.65646,37.425698 115.53847,37.307707 115.53847,37.161145 L115.53847,36.631973 C115.53847,36.485411 115.65646,36.36742 115.80302,36.36742 Z",
  "M117.74329,36.36742 L118.27246,36.36742 C118.41902,36.36742 118.53701,36.485411 118.53701,36.631973 L118.53701,37.161145 C118.53701,37.307707 118.41902,37.425698 118.27246,37.425698 L117.74329,37.425698 C117.59673,37.425698 117.47874,37.307707 117.47874,37.161145 L117.47874,36.631973 C117.47874,36.485411 117.59673,36.36742 117.74329,36.36742 Z",
  "M119.68357,36.36742 L120.21275,36.36742 C120.35931,36.36742 120.4773,36.485411 120.4773,36.631973 L120.4773,37.161145 C120.4773,37.307707 120.35931,37.425698 120.21275,37.425698 L119.68357,37.425698 C119.53701,37.425698 119.41902,37.307707 119.41902,37.161145 L119.41902,36.631973 C119.41902,36.485411 119.53701,36.36742 119.68357,36.36742 Z",
  "M113.86274,38.484074 L114.39192,38.484074 C114.53848,38.484074 114.65647,38.602064 114.65647,38.748627 L114.65647,39.277798 C114.65647,39.424361 114.53848,39.542351 114.39192,39.542351 L113.86274,39.542351 C113.71618,39.542351 113.59819,39.424361 113.59819,39.277798 L113.59819,38.748627 C113.59819,38.602064 113.71618,38.484074 113.86274,38.484074 Z",
  "M115.80314,38.483578 L116.33231,38.483578 C116.47888,38.483578 116.59687,38.601568 116.59687,38.748131 L116.59687,39.277302 C116.59687,39.423865 116.47888,39.541856 116.33231,39.541856 L115.80314,39.541856 C115.65658,39.541856 115.53859,39.423865 115.53859,39.277302 L115.53859,38.748131 C115.53859,38.601568 115.65658,38.483578 115.80314,38.483578 Z",
  "M117.74357,38.483578 L118.27274,38.483578 C118.41931,38.483578 118.5373,38.601568 118.5373,38.748131 L118.5373,39.277302 C118.5373,39.423865 118.41931,39.541856 118.27274,39.541856 L117.74357,39.541856 C117.59701,39.541856 117.47902,39.423865 117.47902,39.277302 L117.47902,38.748131 C117.47902,38.601568 117.59701,38.483578 117.74357,38.483578 Z",
  "M119.68397,38.483578 L120.21314,38.483578 C120.35971,38.483578 120.4777,38.601568 120.4777,38.748131 L120.4777,39.277302 C120.4777,39.423865 120.35971,39.541856 120.21314,39.541856 L119.68397,39.541856 C119.53741,39.541856 119.41942,39.423865 119.41942,39.277302 L119.41942,38.748131 C119.41942,38.601568 119.53741,38.483578 119.68397,38.483578 Z",
  "M115.71484,40.599609 C115.574452,40.5995758 115.439805,40.6553305 115.340536,40.7546003 C115.241268,40.8538701 115.18555,40.9885182 115.18555,41.128906 C115.18555,41.2692938 115.241268,41.4039419 115.340536,41.5032117 C115.439805,41.6024815 115.574452,41.6582362 115.71484,41.658203 L118.36133,41.658203 C118.50172,41.6582388 118.636369,41.6024853 118.73564,41.5032152 C118.834911,41.4039451 118.89063,41.2692955 118.89063,41.128906 C118.89063,40.9885165 118.834911,40.8538669 118.73564,40.7545968 C118.636369,40.6553267 118.50172,40.5995732 118.36133,40.599609 L115.71484,40.599609 Z",
];

const DURATIONS = [
  { value: "sixteenth", pathKey: "sixteenthUp", viewBox: "0 0 55 84" },
  { value: "eighth",    pathKey: "eighthUp",     viewBox: "0 0 54 84" },
  { value: "quarter",   pathKey: "quarterUp",   viewBox: "0 0 28 84" },
  { value: "half",      pathKey: "halfUp",      viewBox: "0 0 29 84" },
  { value: "whole",     pathKey: "whole",       viewBox: "-3 -55 40 84" },
];

const REST_VIEWBOXES = {
  whole:     "-5 -36 52 84",
  half:      "-5 -36 52 84",
  quarter:   "-4 -15 26 84",
  eighth:    "-4 -14 32 84",
  sixteenth: "-2 -9 30 84",
};

const ACCIDENTALS = [
  { value: "sharp",   labelKey: "status.sharp",   iconHeight: 12 },
  { value: "flat",    labelKey: "status.flat",    iconHeight: 18 },
  { value: "natural", labelKey: "status.natural", iconHeight: 17 },
];

const SOUND_ON_PATHS = [
  "M72.7,33.5 C70.7,31.9 67.8,32.2 66.2,34.2 L66.2,34.2 C64.6,36.1 64.7,39.1 66.7,40.6 C69.5,42.8 71.3,46.2 71.3,50 C71.3,53.8 69.5,57.2 66.7,59.4 C64.8,60.9 64.3,63.5 65.8,65.4 L66.2,65.8 C67.8,67.8 70.7,68.1 72.7,66.5 C77.5,62.6 80.6,56.7 80.6,50 C80.5,43.4 77.5,37.4 72.7,33.5 Z",
  "M83.4,20.4 C81.4,18.8 78.5,19.2 76.9,21.1 L76.9,21.1 C75.2,23.1 75.6,26.1 77.7,27.7 C84.1,33 88.2,41 88.2,50 C88.2,59 84.1,67 77.6,72.3 C75.6,74 75.2,76.9 76.8,78.9 L76.8,78.9 C78.4,80.9 81.3,81.2 83.3,79.6 C92,72.7 97.5,62 97.5,50 C97.5,38.1 92,27.4 83.4,20.4 Z",
  "M51.3,12.8 C47.7,11 43.6,11.5 40.4,13.9 L40.4,13.9 L20.7,29.1 L12.1,29.1 C6.8,29.1 2.5,33.4 2.5,38.7 L2.5,61.5 C2.5,66.8 6.8,71.1 12.1,71.1 L20.7,71.1 L40.5,86.3 C42.4,87.7 44.6,88.5 46.8,88.5 C48.4,88.5 49.9,88.1 51.4,87.4 C55,85.7 57.2,82.1 57.2,78.1 L57.2,22.1 C57.1,18.1 54.9,14.6 51.3,12.8 Z M47.6,77.9 C47.6,78 47.6,78.4 47.1,78.7 C46.8,78.9 46.5,78.8 46.2,78.6 L25.2,62.4 C24.4,61.8 23.4,61.4 22.3,61.4 L12,61.4 L12.1,38.5 L22.3,38.5 C23.3,38.5 24.4,38.2 25.2,37.5 L46.2,21.3 C46.3,21.2 46.6,21 47.1,21.2 C47.6,21.4 47.6,21.8 47.6,22 L47.6,77.9 L47.6,77.9 Z",
];
const SOUND_OFF_PATHS = [
  "M52.1,12.2 C48.5,10.4 44.3,10.8 41.1,13.3 L21,28.7 L12.2,28.7 C6.8,28.7 2.5,33.1 2.5,38.4 L2.5,61.5 C2.5,66.9 6.9,71.2 12.2,71.2 L21,71.2 L41.1,86.6 C43,88 45.2,88.8 47.5,88.8 C49.1,88.8 50.7,88.4 52.2,87.7 C55.8,85.9 58.1,82.3 58.1,78.3 L58.1,21.6 C58,17.6 55.7,14 52.1,12.2 Z M48.4,78.4 C48.4,78.5 48.4,79 47.9,79.2 C47.6,79.4 47.3,79.3 47,79.1 L25.6,62.7 C24.8,62.1 23.7,61.7 22.7,61.7 L12.2,61.6 L12.3,38.4 L22.7,38.4 C23.8,38.4 24.8,38 25.6,37.4 L47,21 C47.1,20.9 47.4,20.7 47.9,20.9 C48.4,21.1 48.4,21.6 48.4,21.7 L48.4,78.4 Z",
  "M96.1,37.1 C94.2,35.2 91.2,35.2 89.3,37.1 L83.2,43.2 L77.1,37.1 C75.2,35.2 72.2,35.2 70.3,37.1 C68.4,39 68.4,42 70.3,43.9 L76.4,50 L70.3,56.1 C68.4,58 68.4,61 70.3,62.9 C71.2,63.8 72.5,64.3 73.7,64.3 C74.9,64.3 76.2,63.8 77.1,62.9 L83.2,56.8 L89.3,62.9 C90.2,63.8 91.5,64.3 92.7,64.3 C93.9,64.3 95.2,63.8 96.1,62.9 C98,61 98,58 96.1,56.1 L90,50 L96.1,43.9 C98,42 98,39 96.1,37.1 Z",
];
const PLAY_PATH = "M524.1,859 L472.6,824.7 C468.5,822 463.3,821.8 459,824.1 C454.7,826.4 452,830.9 452,835.7 L452,904.3 C452,909.2 454.7,913.6 459,916 C461,917.1 463.1,917.6 465.2,917.6 C467.8,917.6 470.3,916.9 472.5,915.4 L524.1,881 C527.8,878.5 530,874.4 530,870 C530,865.6 527.8,861.5 524.1,859 Z M465.2,904.3 L465.3,835.7 L516.8,870 L465.2,904.3 Z";
const STOP_PATH = "M251.6,831.5 L188.4,831.5 C179.6,831.5 172.5,838.6 172.5,847.4 L172.5,910.7 C172.5,919.4 179.6,926.6 188.4,926.6 L251.7,926.6 C260.4,926.6 267.6,919.5 267.6,910.7 L267.6,847.4 C267.5,838.6 260.4,831.5 251.6,831.5 Z M254.4,910.6 C254.4,912.1 253.2,913.3 251.7,913.3 L188.4,913.3 C186.9,913.3 185.7,912.1 185.7,910.6 L185.7,847.4 C185.7,845.9 186.9,844.7 188.4,844.7 L251.7,844.7 C253.2,844.7 254.4,845.9 254.4,847.4 L254.4,910.6 L254.4,910.6 Z";
const SAVE_PATHS = [
  "M23.5,48.1600025 C24.6929584,49.3544482 26.3118501,50.025606 28,50.025606 C29.6881499,50.025606 31.3070416,49.3544482 32.5,48.1600025 L40.83,39.8300025 C42.3929658,38.2670366 42.3929658,35.7329683 40.83,34.1700025 C39.2670342,32.6070366 36.7329658,32.6070366 35.17,34.1700025 L32,37.3400025 L32,25.1700025 C32.0417768,23.0607516 30.4834905,21.2607366 28.39,21.0000025 C27.2633537,20.8896156 26.1426924,21.2617878 25.3059128,22.0242293 C24.4691332,22.7866708 23.9946052,23.8679742 24,25.0000025 L24,37.3400025 L20.83,34.1700025 C20.079727,33.4188943 19.061637,32.9968559 18,32.9968559 C16.938363,32.9968559 15.920273,33.4188943 15.17,34.1700025 L15.17,34.1700025 C14.4188918,34.9202755 13.9968534,35.9383655 13.9968534,37.0000025 C13.9968534,38.0616395 14.4188918,39.0797294 15.17,39.8300025 L23.5,48.1600025 Z",
  "M2.27373675e-13,11 L2.27373675e-13,55 C2.27373675e-13,57.6521674 1.0535684,60.1957065 2.92893219,62.0710703 C4.80429597,63.9464341 7.3478351,65 10,65 L46,65 C48.6521649,65 51.195704,63.9464341 53.0710678,62.0710703 C54.9464316,60.1957065 56.0000611,57.6521674 56.0000611,55 L56.0000611,19.6600025 C56.0083238,17.5363188 55.165548,15.4978098 53.66,14 L43,3.34000248 C41.4984232,1.84009391 39.4623704,0.998333557 37.34,1 L10,1 C4.4771525,1 2.27373675e-13,5.47715498 2.27373675e-13,11 Z M37.34,9.00000248 L48,19.6600025 L48,55.0000025 C48,56.104572 47.1045695,57.0000025 46,57.0000025 L10,57.0000025 C8.8954305,57.0000025 8,56.104572 8,55.0000025 L8,11.0000025 C8,9.89543298 8.8954305,9.00000248 10,9.00000248 L37.34,9.00000248 Z",
];
const READ_PATH = "M682.707,855.476534 C672.266,853.710934 661.617,853.527334 651.121,854.933564 C647.1054,855.488254 643.0546,855.765594 639,855.765594 C634.9454,855.765594 630.8945,855.488254 626.879,854.933564 C616.383,853.527364 605.734,853.710864 595.293,855.476534 C594.55081,855.609344 594.0078,856.249974 594,857.003834 L594,860.648334 L594,860.644428 C594,861.054588 594.16406,861.449118 594.45703,861.734228 C594.76562,862.019388 595.16797,862.175638 595.58983,862.179538 C597.01173,862.148288 597.92183,863.023288 598.19923,864.773338 C598.89064,869.128838 600.55863,874.937338 602.40623,877.617338 C603.97653,879.890738 607.67183,882.601738 616.35523,882.601738 C625.18723,882.601738 629.55423,878.797038 631.66423,875.609538 C632.70333,873.898638 633.61343,872.117338 634.39863,870.281438 C635.85173,867.109538 637.50023,865.492338 638.96893,865.492338 C638.980649,865.492338 638.992368,865.496244 639.00018,865.496244 C639.011899,865.496244 639.023618,865.492338 639.03143,865.492338 C640.49623,865.492338 642.14473,867.109538 643.60173,870.281438 C644.38689,872.117338 645.29703,873.898638 646.33613,875.609538 C648.44553,878.800938 652.81663,882.601738 661.64513,882.601738 C670.32873,882.601738 674.02413,879.890838 675.59413,877.617338 C677.44573,874.937638 679.10973,869.129038 679.80113,864.773338 C680.07847,863.023338 680.98863,862.148338 682.41053,862.179538 C682.83241,862.175632 683.23475,862.019378 683.54333,861.734228 C683.8363,861.449068 684.00036,861.054538 684.00036,860.644428 L684.00036,857.003828 C683.992548,856.249918 683.44958,855.609328 682.70736,855.476528 L682.707,855.476534 Z M631.746,864.316334 C631.746,864.316334 631.46084,865.839734 631.38272,866.355434 C630.6171,871.515634 628.37102,875.210934 624.71082,877.343434 C618.70692,880.839534 610.82782,879.109034 608.53882,878.226244 C604.34742,876.609044 601.17552,866.421244 603.15212,860.925244 C604.12087,858.226044 609.31622,857.331444 614.86712,857.331444 L614.863213,857.33535 C619.406213,857.296288 623.929613,857.84707 628.328213,858.97595 C631.945413,860.13615 632.023513,862.81975 631.750113,864.31975 L631.746,864.316334 Z M669.461,878.226334 C667.1719,879.109144 659.293,880.839634 653.289,877.343524 C649.6288,875.210724 647.3828,871.515424 646.6132,866.359524 C646.535075,865.839994 646.24992,864.320424 646.24992,864.320424 C645.97648,862.824324 646.05461,860.140724 649.66792,858.976624 L649.671826,858.976624 C654.070226,857.847724 658.593726,857.296924 663.136826,857.336024 C668.683726,857.336024 673.878826,858.230554 674.851826,860.929824 C676.828426,866.425924 673.656526,876.609824 669.461226,878.226824 L669.461,878.226334 Z";

const UPLOAD_PATHS = [
  "M20.83,36.8500025 L24,33.6800025 L24,45.8500025 C23.9685583,47.9516673 25.5242366,49.740051 27.61,50.0000025 C28.7366463,50.1103893 29.8573076,49.7382172 30.6940872,48.9757757 C31.5308668,48.2133341 32.0053948,47.1320307 32,46.0000025 L32,33.6800025 L35.17,36.8500025 C35.920273,37.6011106 36.938363,38.0231491 38,38.0231491 C39.061637,38.0231491 40.079727,37.6011106 40.83,36.8500025 L40.83,36.8500025 C41.5811082,36.0997294 42.0031466,35.0816395 42.0031466,34.0200025 C42.0031466,32.9583655 41.5811082,31.9402755 40.83,31.1900025 L32.5,22.8600025 C31.3070416,21.6655568 29.6881499,20.994399 28,20.994399 C26.3118501,20.994399 24.6929584,21.6655568 23.5,22.8600025 L15.17,31.2000025 C13.6070343,32.7629683 13.6070343,35.2970366 15.1700001,36.8600024 C16.7329659,38.4229682 19.2670341,38.4229682 20.83,36.8600025 L20.83,36.8500025 Z",
  "M46,65 C48.6521649,65 51.195704,63.9464341 53.0710678,62.0710703 C54.9464316,60.1957065 56.0000611,57.6521674 56.0000611,55 L56.0000611,19.6600025 C56.0083238,17.5363188 55.165548,15.4978098 53.66,14 L43,3.34000248 C41.4984232,1.84009391 39.4623704,0.998333557 37.34,1 L10,1 C4.4771525,1 2.27373675e-13,5.47715498 2.27373675e-13,11 L2.27373675e-13,55 C2.27373675e-13,57.6521674 1.0535684,60.1957065 2.92893219,62.0710703 C4.80429597,63.9464341 7.3478351,65 10,65 L46,65 Z M8,55.0000025 L8,11.0000025 C8,9.89543298 8.8954305,9.00000248 10,9.00000248 L37.34,9.00000248 L48,19.6600025 L48,55.0000025 C48,56.104572 47.1045695,57.0000025 46,57.0000025 L10,57.0000025 C8.8954305,57.0000025 8,56.104572 8,55.0000025 Z",
];

export default function MenuBar({ duration, setDuration, dotted, setDotted, triplet, setTriplet, slur, setSlur, addRest, accidental, setAccidental, isMuted, setIsMuted, isPlaying, startPlayback, stopPlayback, tempo, setTempo, hasNotes, noteCount, notes, setNotes, selectedIdx, setSelectedIdx, updateSelectedNote, noteSystem, setNoteSystem, timeSignature, setTimeSignature, hideLabels, setHideLabels, showShortcuts, setShowShortcuts, saveScore, openScore, onAfterChange }) {
  const { t } = useTranslation();

  const dottedLabel = t("status.dotted");
  const restLabel = t("controls.rest");

  const SHORTCUTS = [
    { label: t("noteSystem.solfeo") + " / " + t("noteSystem.letter"), key: "0" },
    { label: t("shortcuts.sharp"), key: "V" },
    { label: t("shortcuts.timeSignature"), key: "/" },
    { label: t("shortcuts.sixteenth"), key: "1" },
    { label: t("shortcuts.flat"), key: "B" },
    { label: t("shortcuts.language"), key: "L" },
    { label: t("shortcuts.eighth"), key: "2" },
    { label: t("shortcuts.natural"), key: "N" },
    { label: t("shortcuts.save"), key: "⇧S" },
    { label: t("shortcuts.quarter"), key: "3" },
    { label: t("shortcuts.slur"), key: "," },
    { label: t("shortcuts.triplet"), key: "[" },
    { label: t("shortcuts.open"), key: "⇧O" },
    { label: t("shortcuts.half"), key: "4" },
    { label: t("shortcuts.mute"), key: "M" },
    { label: t("shortcuts.title"), key: "K" },
    { label: t("shortcuts.whole"), key: "5" },
    { label: t("shortcuts.playStop"), key: "P" },
    { label: t("shortcuts.clearScore"), key: "⇧⌫" },
    { label: t("shortcuts.delete"), key: "⌫" },
  ];

  return (
    <div className="menu-bar">
      <div className="menu-bar__content">
        <button
          className="menu-bar__btn"
          style={{ width: 72, height: 36, fontSize: 11, color: "#A2A49F", fontWeight: 600 }}
          title={noteSystem === "solfeo" ? t("menubar.switchToABC") : t("menubar.switchToSolfeo")}
          aria-label={noteSystem === "solfeo" ? t("menubar.switchToABC") : t("menubar.switchToSolfeo")}
          onClick={() => { setNoteSystem(ns => ns === "solfeo" ? "letter" : "solfeo"); onAfterChange?.(); }}
        >
          {noteSystem === "solfeo" ? "Do Re Mi" : "A B C"}
        </button>

        <button
          className={`menu-bar__btn ${!hideLabels ? "menu-bar__btn--active" : ""}`}
          title={t("playback.hideLabels")}
          aria-label={t("playback.hideLabels")}
          onClick={() => { setHideLabels(h => !h); onAfterChange?.(); }}
        >
          <svg viewBox="594 853 90 30" width="24" height="24" aria-hidden="true">
            <path d={READ_PATH} fill={!hideLabels ? "#1767AE" : "#A2A49F"} />
          </svg>
        </button>

        <button
          className="menu-bar__btn"
          style={{ width: 36, height: 36, fontSize: 11, color: "#A2A49F", fontWeight: 600 }}
          title={t("menubar.timeSignature")}
          aria-label={`${t("menubar.timeSignature")} ${timeSignature.label}`}
          onClick={() => {
            setTimeSignature(ts => {
              const idx = TIME_SIGNATURES.findIndex(sig => sig.label === ts.label);
              const newIdx = idx >= TIME_SIGNATURES.length - 1 ? 0 : idx + 1;
              return TIME_SIGNATURES[newIdx];
            });
            onAfterChange?.();
          }}
        >
          {timeSignature.label}
        </button>

        <div className="menu-bar__separator" />

        {DURATIONS.map(d => {
          const label = t(`duration.${d.value}`);
          return (
            <button
              key={d.value}
              className={`menu-bar__btn ${duration === d.value ? "menu-bar__btn--active" : ""}`}
              title={label}
              aria-label={label}
              onClick={() => { if (selectedIdx !== null) updateSelectedNote("duration", d.value); setDuration(d.value); onAfterChange?.(); }}
            >
              <svg viewBox={d.viewBox} width="24" height="24" aria-hidden="true">
                <path d={NOTE_PATHS[d.pathKey].path} fill={duration === d.value ? "#1767AE" : "#A2A49F"} />
              </svg>
            </button>
          );
        })}

        <div className="menu-bar__separator" />

        <button
          className={`menu-bar__btn ${dotted ? "menu-bar__btn--active" : ""}`}
          title={dottedLabel}
          aria-label={dottedLabel}
          onClick={() => { if (selectedIdx !== null) { const note = notes[selectedIdx]; updateSelectedNote("dotted", !note.dotted); } setDotted(d => !d); onAfterChange?.(); }}
        >
          <svg viewBox="0 0 36 84" width="24" height="24" aria-hidden="true">
            <path d={NOTE_PATHS.quarterUp.path} fill={dotted ? "#1767AE" : "#A2A49F"} />
            <circle cx="40" cy="71" r="5" fill={dotted ? "#1767AE" : "#A2A49F"} />
          </svg>
        </button>

        <button
          className="menu-bar__btn"
          title={restLabel}
          aria-label={restLabel}
          onClick={() => { addRest(); onAfterChange?.(); }}
        >
          <svg viewBox={REST_VIEWBOXES[duration]} width="24" height="24" aria-hidden="true">
            <path d={REST_PATHS[duration].path} fill="#A2A49F" />
          </svg>
        </button>

        <div className="menu-bar__separator" />

        {ACCIDENTALS.map(a => {
          const label = t(a.labelKey);
          const acc = ACCIDENTAL_PATHS[a.value];
          const isActive = accidental === a.value;
          return (
            <button
              key={a.value}
              className={`menu-bar__btn ${isActive ? "menu-bar__btn--active" : ""}`}
              title={label}
              aria-label={label}
              onClick={() => { const newVal = accidental === a.value ? null : a.value; if (selectedIdx !== null) updateSelectedNote("accidental", newVal); setAccidental(newVal); onAfterChange?.(); }}
            >
              <svg viewBox={`0 0 ${acc.width} ${acc.height}`} width={Math.round(acc.width / acc.height * a.iconHeight)} height={a.iconHeight} aria-hidden="true">
                <g transform={`translate(${acc.translateX}, ${acc.translateY})`}>
                  <path d={acc.path} fill={isActive ? "#1767AE" : "#A2A49F"} />
                </g>
              </svg>
            </button>
          );
        })}

        <div className="menu-bar__separator" />

        <button
          className={`menu-bar__btn ${slur ? "menu-bar__btn--active" : ""}`}
          title={t("status.slur")}
          aria-label={t("status.slur")}
          onClick={() => { if (selectedIdx !== null) { const note = notes[selectedIdx]; updateSelectedNote("slur", !note.slur); } setSlur(s => { if (!s) setTriplet(false); return !s; }); onAfterChange?.(); }}
        >
          <svg viewBox="0 0 89 101" width="20" height="20" aria-hidden="true">
            <path d="M27.0555311,68.458 L27.0555311,0.5499 C27.0555311,0.246 26.8153016,0 26.5052016,0 L24.0753016,0 C23.7752016,0 23.5252016,0.246 23.5252016,0.5499 L23.5252016,62.9409 C19.9353016,61.156 14.4553016,61.4799 9.29525157,64.166 C2.11520157,67.898 -1.71475843,74.75198 0.745205571,79.47396 C3.19528157,84.196983 11.0052016,85.00094 18.1853016,81.26894 C24.1753016,78.15499 27.0853016,72.852 27.0555311,68.458 Z" fill={slur ? "#1767AE" : "#A2A49F"} />
            <path d="M88.0555311,68.458 L88.0555311,0.5499 C88.0555311,0.246 87.8153016,0 87.5052016,0 L85.0753016,0 C84.7752016,0 84.5252016,0.246 84.5252016,0.5499 L84.5252016,62.9409 C80.9353016,61.156 75.4553016,61.4799 70.2952516,64.166 C63.1152016,67.898 59.2852416,74.75198 61.7452056,79.47396 C64.1952816,84.196983 72.0052016,85.00094 79.1853016,81.26894 C85.1753016,78.15499 88.0853016,72.852 88.0555311,68.458 Z" fill={slur ? "#1767AE" : "#A2A49F"} />
            <path d="M16.9046058,87.8058574 C24.3710665,92.9235954 33.586914,95.4824644 44.5521484,95.4824644 C55.5173828,95.4824644 64.4494253,92.9235954 71.3482759,87.8058574 C72.3965529,88.3745407 72.8509422,88.8103165 72.7114439,89.1131848 C69.2011904,96.7343857 58.5246616,100.641188 44.5521484,100.641188 C30.3947821,100.641188 19.7635492,96.937373 15.8280929,89.1131848 C15.7079959,88.8744167 16.0668336,88.4386409 16.9046058,87.8058574 Z" fill={slur ? "#1767AE" : "#A2A49F"} />
          </svg>
        </button>

        <button
          className={`menu-bar__btn ${triplet ? "menu-bar__btn--active" : ""}`}
          title={t("status.triplet")}
          aria-label={t("status.triplet")}
          onClick={() => { if (selectedIdx !== null) { const note = notes[selectedIdx]; updateSelectedNote("triplet", !note.triplet); } setTriplet(t => { if (!t) setSlur(false); return !t; }); onAfterChange?.(); }}
        >
          <svg viewBox="0 0 44 50" width="24" height="24" style={{marginTop: -3}} aria-hidden="true">
            {/* 3 beamed eighth notes */}
            <ellipse cx="6" cy="44" rx="5" ry="3.5" transform="rotate(-20 6 44)" fill={triplet ? "#1767AE" : "#A2A49F"} />
            <ellipse cx="20" cy="44" rx="5" ry="3.5" transform="rotate(-20 20 44)" fill={triplet ? "#1767AE" : "#A2A49F"} />
            <ellipse cx="34" cy="44" rx="5" ry="3.5" transform="rotate(-20 34 44)" fill={triplet ? "#1767AE" : "#A2A49F"} />
            {/* Stems */}
            <line x1="10.5" y1="42" x2="10.5" y2="18" stroke={triplet ? "#1767AE" : "#A2A49F"} strokeWidth="2" />
            <line x1="24.5" y1="42" x2="24.5" y2="18" stroke={triplet ? "#1767AE" : "#A2A49F"} strokeWidth="2" />
            <line x1="38.5" y1="42" x2="38.5" y2="18" stroke={triplet ? "#1767AE" : "#A2A49F"} strokeWidth="2" />
            {/* Beam */}
            <rect x="9.5" y="16" width="30" height="3" fill={triplet ? "#1767AE" : "#A2A49F"} />
            {/* Bracket and 3 */}
            <line x1="9.5" y1="12" x2="9.5" y2="8" stroke={triplet ? "#1767AE" : "#A2A49F"} strokeWidth="1.5" />
            <line x1="9.5" y1="8" x2="17" y2="8" stroke={triplet ? "#1767AE" : "#A2A49F"} strokeWidth="1.5" />
            <line x1="27" y1="8" x2="38.5" y2="8" stroke={triplet ? "#1767AE" : "#A2A49F"} strokeWidth="1.5" />
            <line x1="38.5" y1="12" x2="38.5" y2="8" stroke={triplet ? "#1767AE" : "#A2A49F"} strokeWidth="1.5" />
            <text x="22" y="11" textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="Georgia, serif" fill={triplet ? "#1767AE" : "#A2A49F"}>3</text>
          </svg>
        </button>

        <div className="menu-bar__separator" />

        <button
          className="menu-bar__btn"
          title={isMuted ? t("playback.muted") : t("playback.sound")}
          aria-label={isMuted ? t("playback.muted") : t("playback.sound")}
          onClick={() => { setIsMuted(m => !m); onAfterChange?.(); }}
        >
          {isMuted ? (
            <svg viewBox="0 8 98 82" width="18" height="18" style={{marginLeft: 0}} aria-hidden="true">
              {SOUND_OFF_PATHS.map((d, i) => <path key={i} d={d} fill="#A2A49F" />)}
            </svg>
          ) : (
            <svg viewBox="0 11 98 78" width="18" height="18" aria-hidden="true">
              {SOUND_ON_PATHS.map((d, i) => <path key={i} d={d} fill="#1767AE" />)}
            </svg>
          )}
        </button>

        <button
          className="menu-bar__btn"
          title={isPlaying ? t("playback.stop") : t("playback.play")}
          aria-label={isPlaying ? t("playback.stop") : t("playback.play")}
          disabled={!hasNotes && !isPlaying}
          style={!hasNotes && !isPlaying ? { opacity: 0.3, cursor: "default" } : undefined}
          onClick={() => { if (!hasNotes && !isPlaying) return; isPlaying ? stopPlayback() : startPlayback(); onAfterChange?.(); }}
        >
          {isPlaying ? (
            <svg viewBox="172 831 96 96" width="16" height="16" aria-hidden="true">
              <path d={STOP_PATH} fill="#e63946" />
            </svg>
          ) : (
            <svg viewBox="452 822 78 96" width="16" height="16" aria-hidden="true">
              <path d={PLAY_PATH} fill="#A2A49F" />
            </svg>
          )}
        </button>

        <div className="menu-bar__btn" style={{ display: "flex", alignItems: "center", gap: 4, cursor: "default", width: "auto", pointerEvents: "none" }}>
          <svg viewBox="0 0 28 84" width="14" height="14" aria-hidden="true">
            <path d={NOTE_PATHS.quarterUp.path} fill="#A2A49F" />
          </svg>
          <span style={{ color: "#A2A49F", fontSize: 12, fontWeight: 600 }}>=</span>
          <span style={{ color: "#A2A49F", fontSize: 12, fontWeight: 600, minWidth: 24, textAlign: "center" }}>{tempo}</span>
        </div>

        <input
          type="range"
          min="40" max="240" value={tempo}
          onChange={(e) => { setTempo(Number(e.target.value)); onAfterChange?.(); }}
          className="menu-bar__tempo-slider"
          style={{ background: `linear-gradient(to right, #1767AE ${(tempo - 40) / 200 * 100}%, #A2A49F ${(tempo - 40) / 200 * 100}%)` }}
        />

        <div className="menu-bar__separator" />

        <div className="menu-bar__btn menu-bar__count" aria-label={`${noteCount} ${noteCount !== 1 ? t("status.notes") : t("status.note")}`}>
          {noteCount}
        </div>

        <div className="menu-bar__separator" />

        <button
          className="menu-bar__btn"
          title={t("menubar.save")}
          aria-label={t("menubar.save")}
          disabled={!hasNotes}
          style={!hasNotes ? { opacity: 0.3, cursor: "default" } : undefined}
          onClick={() => { saveScore(); }}
        >
          <svg viewBox="-2 0 60 66" width="18" height="18" aria-hidden="true">
            {SAVE_PATHS.map((d, i) => <path key={i} d={d} fill="#A2A49F" />)}
          </svg>
        </button>

        <button
          className="menu-bar__btn"
          title={t("menubar.open")}
          aria-label={t("menubar.open")}
          onClick={() => { openScore(); }}
        >
          <svg viewBox="-2 0 60 66" width="18" height="18" aria-hidden="true">
            {UPLOAD_PATHS.map((d, i) => <path key={i} d={d} fill="#A2A49F" />)}
          </svg>
        </button>

        <div className="menu-bar__separator" />

        <button
          className="menu-bar__btn"
          style={{ width: 36, height: 36, fontSize: 11, color: "#A2A49F", fontWeight: 600 }}
          title={i18n.language === "es" ? t("menubar.switchLangEN") : t("menubar.switchLangES")}
          aria-label={i18n.language === "es" ? t("menubar.switchLangEN") : t("menubar.switchLangES")}
          onClick={() => { i18n.changeLanguage(i18n.language === "es" ? "en" : "es"); onAfterChange?.(); }}
        >
          {i18n.language === "es" ? "ES" : "EN"}
        </button>

        <button
          className="menu-bar__btn"
          title={t("shortcuts.title")}
          aria-label={t("shortcuts.title")}
          onClick={() => { setShowShortcuts(s => !s); }}
        >
          <svg viewBox="111.5 34 11 10" width="16" height="15" aria-hidden="true">
            {KEYBOARD_ICON_PATHS.map((d, i) => <path key={i} d={d} fill={showShortcuts ? "#1767AE" : "#A2A49F"} />)}
          </svg>
        </button>
      </div>

      {showShortcuts && (
        <div className="shortcuts-overlay" onClick={() => setShowShortcuts(false)}>
          <div className="shortcuts-overlay__content" onClick={(e) => e.stopPropagation()}>
            <div className="shortcuts-overlay__header">
              <span className="shortcuts-overlay__title">{t("shortcuts.title")}</span>
              <button className="shortcuts-overlay__close" onClick={() => setShowShortcuts(false)}>✕</button>
            </div>
            <div className="shortcuts-overlay__grid">
              {SHORTCUTS.map((s, i) => (
                <div key={i} className="shortcuts-overlay__item">
                  <span className="shortcuts-overlay__label">{s.label}</span>
                  <span className="shortcuts-overlay__key">{s.key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
