# Tanzaku (短冊)

**Tanzaku** is an elegant, client-side image slicer built with React, TypeScript, and Vite. It allows you to easily slice images into equal-width strips, perfect for Instagram carousels, web sprites, and creative projects.

![Tanzaku Preview](public/favicon.svg)

## Features

-   **Drag & Drop Interface**: Easily upload images.
-   **Real-time Preview**: See your slices before you download.
-   **Flexible Controls**: Adjust slice width or slice count.
-   **Client-Side Processing**: Your images never leave your browser.
-   **Download Options**: Download individual slices or all at once (ZIP support).

## Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **Styling**: Tailwind CSS
-   **State Management**: React Hooks
-   **Icons**: Lucide React
-   **Utils**: JSZip, html2canvas

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/tanzaku.git
    cd tanzaku
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1.  Drag and drop an image onto the drop zone.
2.  Use the slider to adjust the slice width or the number of slices.
3.  Preview the slices in real-time.
4.  Click "Download All" to get your slices.

## License

MIT
