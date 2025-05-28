1.
rowData: While not a specific optimization property, how you manage and update the data passed to rowData is crucial. Using immutable data updates (creating new arrays/objects instead of modifying existing ones) along with the immutableData property and getRowId callback significantly boosts performance by allowing AG Grid to quickly determine what has changed.
immutableData={true}: Tells the grid that you will provide immutable data.
getRowId={...}: A callback function that provides a unique ID for each row, essential for immutableData.
2.
rowModelType: This is fundamental for large datasets.
"clientSide": Suitable for datasets that fit comfortably in memory (hundreds to thousands of rows). All data is loaded into the browser. This is what is currently used in AnChart.
"infinite", "viewport", "serverSide": Used for very large datasets (tens of thousands to millions of rows) where data is loaded in blocks or on demand from the server as the user scrolls or navigates.
3.
pagination / paginationPageSize: Breaks down a large dataset into smaller pages, reducing the number of rows the grid has to render and manage simultaneously.
pagination={true}: Enables pagination.
paginationPageSize={number}: Sets the number of rows per page.
4.
rowBuffer: Controls how many rows are rendered outside the visible viewport. Increasing this can make scrolling smoother, but setting it too high can negate the benefits of virtualization.
rowBuffer={number}: The number of rows to render above and below the visible area. (Currently set to 10 in AnChart).
5.
cacheBlockSize: Used with server-side row models (infinite, viewport). Determines how many rows the grid fetches in each request to the server. A larger block size means fewer requests but more data transferred per request.
cacheBlockSize={number}: Number of rows per block. (Currently set to 20 in AnChart, relevant if you switch to a server-side model).
6.
defaultColDef: Provides default properties for all columns. This simplifies column definition and can slightly improve performance by avoiding redundant property checks on individual columns.
7.
Column Properties (sortable, filter, resizable, flex, minWidth): Configuring these correctly on your column definitions helps.
sortable, filter: Enable sorting and filtering, which have performance implications, especially client-side with huge datasets. AG Grid's implementations are generally performant, but complex custom filters can impact this.
resizable, flex, minWidth: Help the grid manage column widths efficiently, which is important for rendering speed. flex is good for making columns fill the available space responsively.
8.
animateRows: Controls row animation (e.g., when sorting or filtering). Setting this to false can provide a minor performance boost, especially on less powerful devices, but it affects the user experience.
animateRows={true/false}: Enable or disable row animations. (Currently true in AnChart).
9.
debounceVerticalScrollbar: Delays filtering and sorting until the user stops scrolling vertically. This prevents unnecessary calculations during rapid scrolling.
debounceVerticalScrollbar={true/false}: Enable or disable debouncing. (Currently true in AnChart).
The AnChart component you have already utilizes many of these properties (pagination, paginationPageSize, rowBuffer, defaultColDef, sortable, filter, resizable, flex, minWidth, animateRows, debounceVerticalScrollbar). For client-side data (which you are currently using), this is a very good starting point for performance.
If you were dealing with truly massive datasets (millions of rows), switching the rowModelType to "infinite" or "serverSide" and implementing the corresponding server-side data loading would be the next necessary step for optimization.