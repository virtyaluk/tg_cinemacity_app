export type MovieListItem = {
    backdrop_path: string;
    id: number;
    poster_path: string;
    release_date: string;
    title: string;
    genre_ids: number[];
    vote_average: number;
}

export type ConfigImages = {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
}

export type MovieImage = {
    height: number;
    file_path: string;
    width: number;
}

export type NowPlayingQueryParams = {
    lang?: string;
    page?: string;
    region?: string;
}

export type GetConfigQueryParams = {
    lang?: string;
}

export type GetMovieByIdQueryParams = {
    lang?: string;
    include_image_language?: string;
    posters_count?: number;
    logos_count?: number;
    backdrops_count?: number;
}

export type MovieListResponse = {
    movies: MovieListItem[];
    page: number;
    total_pages: number;
}

export type MovieGenre = {
    id: number;
    name: string
}

export type ConfigResponse = {
    images: ConfigImages;
    genres: MovieGenre[];
}

export interface Ticket {
    runtime: number;
    title: string;
    datetime: number;
    code: string;
    seats: TakenSeat[];
    poster_path: string;
}

export interface TicketsResponse {
    tickets: Ticket[];
    num_tickets: number;
}

export interface IMDbMovieInfo {
    rating: number;
    content_rating: string;
    rating_count: number;
    directors: string[];
}

export interface MovieDetailsResponse {
    id: number;
    title: string;
    overview: string;
    tagline: string;
    release_date: string;
    runtime: number;
    poster_path: string;
    backdrop_path: string;
    genres: string[];
    backdrops: MovieImage[];
    logos: MovieImage[];
    posters: MovieImage[];
    vote_average: number;
    vote_count: number;
    imdb_id: string;
    imdb_info: IMDbMovieInfo;
}

export type GetMovieCreditsByIdQueryParams = {
    lang?: string;
    cast_count?: number;
}

export interface GetShowTakenSeatsQueryParams {
    show_id?: string;
}

export type MovieCastMember = {
    id: number;
    name: string;
    profile_path: string;
}

export type MovieCreditsResponse = {
    id: number;
    cast: MovieCastMember[]
}

export enum CinemaHallSeatType {
    regular = 0,
    vip = 1,
}

export interface CinemaHallSeatSchema {
    type: CinemaHallSeatType;
    row: number;
    num: number;
}

export interface CinemaHallRowSchema {
    seats: CinemaHallSeatSchema[];
}

export interface CinemaHallSchema {
    rows: CinemaHallRowSchema[];
}

export type TicketPrice = {
    [key in CinemaHallSeatType]: number;
};

export interface TicketPrices {
    prices: TicketPrice;
}

export interface MovieShowTimeSlot {
    hour: number;
    minute: number;
}

export interface MovieScheduleResponse {
    hall_schema: CinemaHallSchema;
    ticket_prices: TicketPrices;
    showtime_slots: MovieShowTimeSlot[];
}

export interface TakenSeat {
    seat: number;
    row: number;
}

export interface ShowTakenSeats {
    taken_seats: TakenSeat[];
}

export interface WebAppUser {
    id: number;
    is_bot?: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
}

export interface WebAppChat {
    id: number;
    type: "group" | "supergroup" | "channel";
    title: string;
    username?: string;
    photo_url?: string;
}

export interface WebAppInitData {
    query_id?: string;
    auth_date: number;
    hash: string;
    user?: WebAppUser & {
        added_to_attachment_menu?: boolean;
        allows_write_to_pm?: boolean;
    };
    receiver?: WebAppUser;
    start_param?: string;
    can_send_after?: number;
    chat?: WebAppChat;
    chat_type?: "sender" | "private" | "group" | "supergroup" | "channel";
    chat_instance?: string;
}

export interface ThemeParams {
    bg_color: `#${string}`;
    secondary_bg_color: `#${string}`;
    text_color: `#${string}`;
    hint_color: `#${string}`;
    link_color: `#${string}`;
    button_color: `#${string}`;
    button_text_color: `#${string}`;
}

export interface HapticFeedback {
    impactOccurred: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft"
    ) => HapticFeedback;
    notificationOccurred: (
      type: "error" | "success" | "warning"
    ) => HapticFeedback;
    selectionChanged: () => HapticFeedback;
}

type CloudStorageKey = string;
type CloudStorageValue = string;

interface CloudStorageItems {
    [key: CloudStorageKey]: CloudStorageValue;
}

export interface CloudStorage {
    setItem: (
      key: CloudStorageKey,
      value: CloudStorageValue,
      callback?: (error: string | null, result?: boolean) => void
    ) => void;
    getItem: (
      key: CloudStorageKey,
      callback?: (error: string | null, result?: CloudStorageValue) => void
    ) => void;
    getItems: (
      keys: Array<CloudStorageKey>,
      callback?: (error: string | null, result?: CloudStorageItems) => void
    ) => void;
    getKeys: (
      callback?: (error: string | null, result?: Array<CloudStorageKey>) => void
    ) => void;
    removeItem: (
      key: CloudStorageKey,
      callback?: (error: string | null, result?: boolean) => void
    ) => void;
    removeItems: (
      key: Array<CloudStorageKey>,
      callback?: (error: string | null, result?: boolean) => void
    ) => void;
}

export interface BackButton {
    isVisible: boolean;
    show: VoidFunction;
    hide: VoidFunction;
    onClick: (cb: VoidFunction) => void;
    offClick: (cb: VoidFunction) => void;
}

export interface MainButton {
    isActive: boolean;
    isVisible: boolean;
    isProgressVisible: boolean;
    text: string;
    color: `#${string}`;
    textColor: `#${string}`;
    show: VoidFunction;
    hide: VoidFunction;
    enable: VoidFunction;
    disable: VoidFunction;
    hideProgress: VoidFunction;
    showProgress: (leaveActive?: boolean) => void;
    onClick: (callback: VoidFunction) => void;
    offClick: (callback: VoidFunction) => void;
    setText: (text: string) => void;
    setParams: (params: {
        color?: string;
        text?: string;
        text_color?: string;
        is_active?: boolean;
        is_visible?: boolean;
    }) => void;
}

export type InvoiceStatuses = "pending" | "failed" | "cancelled" | "paid";

export type EventNames =
  | "invoiceClosed"
  | "settingsButtonClicked"
  | "backButtonClicked"
  | "mainButtonClicked"
  | "viewportChanged"
  | "themeChanged"
  | "popupClosed"
  | "qrTextReceived"
  | "clipboardTextReceived"
  | "writeAccessRequested"
  | "contactRequested";

export type EventParams = {
    invoiceClosed: { url: string; status: InvoiceStatuses };
    settingsButtonClicked: void;
    backButtonClicked: void;
    mainButtonClicked: void;
    viewportChanged: { isStateStable: boolean };
    themeChanged: void;
    popupClosed: { button_id: string | null };
    qrTextReceived: { data: string };
    clipboardTextReceived: { data: string };
    writeAccessRequested: { status: "allowed" | "cancelled" };
    contactRequested: { status: "sent" | "cancelled" };
};

export type PopupParams = {
    title?: string;
    message: string;
    buttons?: PopupButton[];
};

export type PopupButton = {
    id?: string;
} & (
  | {
    type: "default" | "destructive";
    text: string;
}
  | {
    type: "ok" | "close" | "cancel";
}
  );

export type ScanQrPopupParams = {
    text?: string;
};

export type Platforms =
  | "android"
  | "android_x"
  | "ios"
  | "macos"
  | "tdesktop"
  | "weba"
  | "webk"
  | "unigram"
  | "unknown";

export interface WebApp {
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    platform: Platforms;
    headerColor: `#${string}`;
    backgroundColor: `#${string}`;
    isClosingConfirmationEnabled: boolean;
    themeParams: ThemeParams;
    initDataUnsafe: WebAppInitData;
    initData: string;
    colorScheme: "light" | "dark";
    onEvent: <T extends EventNames>(
      eventName: T,
      callback: (params: EventParams[T]) => unknown
    ) => void;
    offEvent: <T extends EventNames>(
      eventName: T,
      callback: (params: EventParams[T]) => unknown
    ) => void;
    sendData: (data: unknown) => void;
    close: VoidFunction;
    expand: VoidFunction;
    MainButton: MainButton;
    HapticFeedback: HapticFeedback;
    CloudStorage: CloudStorage;
    openLink: (link: string, options?: { try_instant_view: boolean }) => void;
    openTelegramLink: (link: string) => void;
    BackButton: BackButton;
    version: string;
    isVersionAtLeast: (version: string) => boolean;
    openInvoice: (
      url: string,
      callback?: (status: InvoiceStatuses) => unknown
    ) => void;
    setHeaderColor: (
      color: "bg_color" | "secondary_bg_color" | `#${string}`
    ) => void;
    setBackgroundColor: (
      color: "bg_color" | "secondary_bg_color" | `#${string}`
    ) => void;
    showConfirm: (
      message: string,
      callback?: (confirmed: boolean) => void
    ) => void;
    showPopup: (params: PopupParams, callback?: (id?: string) => unknown) => void;
    showAlert: (message: string, callback?: () => unknown) => void;
    enableClosingConfirmation: VoidFunction;
    disableClosingConfirmation: VoidFunction;
    showScanQrPopup: (
      params: ScanQrPopupParams,
      callback?: (text: string) => void | true
    ) => void;
    closeScanQrPopup: () => void;
    readTextFromClipboard: (callback?: (text: string) => unknown) => void;
    ready: VoidFunction;
    switchInlineQuery: (
      query: string,
      chooseChatTypes?: Array<"users" | "bots" | "groups" | "channels">
    ) => void;
    requestWriteAccess: (callback?: (access: boolean) => unknown) => void;
    requestContact: (callback?: (access: boolean) => unknown) => void;
}

export interface Telegram {
    WebApp: WebApp;
}
