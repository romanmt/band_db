let Hooks = {}
// Use the global Sortable object instead of importing it
// import Sortable from "sortablejs"

Hooks.RehearsalHistory = {
  mounted() {
    this.handleEvent("print_plan", ({date}) => {
      // Hide the main content
      document.getElementById('rehearsal-history').style.display = 'none';
      
      // Hide all print plans except the one we want to print
      const printPlans = document.querySelectorAll('.print-plan');
      printPlans.forEach(plan => {
        plan.style.display = 'none';
      });
      
      // Show only the plan we want to print
      const targetPlan = document.querySelector(`.print-plan[data-date="${date}"]`);
      if (targetPlan) {
        targetPlan.style.display = 'block';
      }
      
      // Show the print-only container
      document.querySelector('.print-only').classList.remove('hidden');
      
      // Wait a short moment for the content to be visible
      setTimeout(() => {
        window.print();
        
        // Restore the main content and hide the print-only container
        document.getElementById('rehearsal-history').style.display = 'block';
        document.querySelector('.print-only').classList.add('hidden');
      }, 100);
    });
  }
}

Hooks.SetListHistory = {
  mounted() {
    this.handleEvent("print_set_list", ({name}) => {
      // Hide the main content
      document.getElementById('set-list-history').style.display = 'none';
      
      // Hide all print set lists except the one we want to print
      const printSetLists = document.querySelectorAll('.print-setlist');
      printSetLists.forEach(setList => {
        setList.style.display = 'none';
      });
      
      // Show only the set list we want to print
      const targetSetList = document.querySelector(`.print-setlist[data-name="${name}"]`);
      if (targetSetList) {
        targetSetList.style.display = 'block';
      }
      
      // Show the print-only container
      document.querySelector('#setlist-print-container').classList.remove('hidden');
      
      // Wait a short moment for the content to be visible
      setTimeout(() => {
        window.print();
        
        // Restore the main content and hide the print-only container
        document.getElementById('set-list-history').style.display = 'block';
        document.querySelector('#setlist-print-container').classList.add('hidden');
      }, 100);
    });
  }
}

Hooks.SortableSongs = {
  mounted() {
    const hook = this;
    
    // Use the global Sortable object
    new Sortable(this.el, {
      animation: 150,
      handle: ".drag-handle",
      ghostClass: "sortable-ghost",
      dragClass: "sortable-drag",
      onEnd: function(evt) {
        const songId = evt.item.dataset.songId;
        const newIndex = evt.newIndex;
        const oldIndex = evt.oldIndex;
        const setIndex = hook.el.dataset.setIndex;
        
        if (newIndex !== oldIndex) {
          hook.pushEvent("reorder_song", {
            song_id: songId.toString(),
            old_index: oldIndex.toString(),
            new_index: newIndex.toString(),
            set_index: setIndex.toString()
          });
        }
      }
    });
  }
}

Hooks.FlashAutoDismiss = {
  mounted() {
    setTimeout(() => {
      // Only auto-dismiss if the element is still present
      if (this.el) {
        this.el.dispatchEvent(new Event('click', {bubbles: true}));
      }
    }, 4000); // 4 seconds
  }
}

Hooks.AgGrid = {
  mounted() {
    this.gridApi = null;
    
    // Check if createGrid is available
    if (!window.createGrid) {
      console.error('AG Grid createGrid not available');
      return;
    }
    
    // Custom cell renderers
    const statusCellRenderer = (params) => {
        const statusColors = {
          'suggested': 'bg-purple-100 text-purple-800',
          'needs_learning': 'bg-yellow-100 text-yellow-800',
          'needs_rehearsing': 'bg-orange-100 text-orange-800',
          'ready': 'bg-green-100 text-green-800',
          'performed': 'bg-blue-100 text-blue-800'
        };
        
        const statusLabels = {
          'suggested': 'Suggested',
          'needs_learning': 'Needs Learning',
          'needs_rehearsing': 'Needs Rehearsing',
          'ready': 'Ready',
          'performed': 'Performed'
        };
        
        const status = params.value;
        const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
        const label = statusLabels[status] || status;
        
        return `<span class="text-xs sm:text-sm rounded-full px-2 sm:px-3 py-1 font-medium ${colorClass}">${label}</span>`;
      };
      
      const actionsCellRenderer = (params) => {
        const data = params.data;
        let actions = '<div class="flex items-center space-x-1 sm:space-x-2">';
        
        if (data.notes && data.notes.trim() !== '') {
          actions += `
            <button class="text-gray-400 hover:text-gray-600 p-1" title="View notes">
              <svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </button>
          `;
        }
        
        if (data.youtube_link) {
          actions += `
            <a href="${data.youtube_link}" target="_blank" class="text-indigo-600 hover:text-indigo-900 flex items-center p-1" title="Watch on YouTube">
              <svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </a>
          `;
        }
        
        const escapedTitle = data.title.replace(/'/g, "\\'").replace(/"/g, '\\"');
        actions += `
          <button class="text-indigo-600 hover:text-indigo-900 p-1" title="Edit song" onclick="window.dispatchEvent(new CustomEvent('ag-grid-edit', {detail: {title: '${escapedTitle}', band_id: ${data.band_id}}}))">
            <svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
        `;
        
        actions += '</div>';
        return actions;
      };
      
      // Value formatters
      const tuningFormatter = (params) => {
        const tuningDisplay = {
          'standard': 'Standard',
          'drop_d': 'Drop D',
          'e_flat': 'E♭',
          'drop_c_sharp': 'Drop C#'
        };
        return tuningDisplay[params.value] || params.value;
      };
      
      const durationFormatter = (params) => {
        if (!params.value) return '—';
        const minutes = Math.floor(params.value / 60);
        const seconds = params.value % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };
      
      // Listen for custom edit events
      this.editHandler = (event) => {
        this.pushEvent("row-clicked", event.detail);
      };
      window.addEventListener('ag-grid-edit', this.editHandler);
      
      // Listen for grid configuration from server
      this.handleEvent("load-grid", (gridOptions) => {
        // Destroy existing grid if it exists
        if (this.gridApi) {
          this.gridApi.destroy();
        }
        
        // Add custom components
        gridOptions.components = {
          statusCellRenderer,
          actionsCellRenderer
        };
        
        // Add value formatters
        gridOptions.columnDefs = gridOptions.columnDefs.map(col => {
          if (col.valueFormatter === 'tuningFormatter') {
            col.valueFormatter = tuningFormatter;
          } else if (col.valueFormatter === 'durationFormatter') {
            col.valueFormatter = durationFormatter;
          }
          return col;
        });
        
        // Add row click handler
        gridOptions.onRowClicked = (event) => {
          // Only trigger if not clicking on action buttons
          if (!event.event.target.closest('button') && !event.event.target.closest('a')) {
            this.pushEvent("row-clicked", { 
              title: event.data.title,
              band_id: event.data.band_id 
            });
          }
        };
        
        // Create new grid with provided options
        const gridApi = window.createGrid(this.el, gridOptions);
        this.gridApi = gridApi;
      });
      
      // Listen for data updates
      this.handleEvent("update-grid-data", ({ rowData }) => {
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', rowData);
        }
      });
      
      // Listen for quick filter updates
      this.handleEvent("update-quick-filter", ({ quickFilterText }) => {
        if (this.gridApi) {
          this.gridApi.setGridOption('quickFilterText', quickFilterText);
        }
      });
  },
  
  destroyed() {
    // Clean up grid when component is destroyed
    if (this.gridApi) {
      this.gridApi.destroy();
    }
    
    // Remove event listener
    if (this.editHandler) {
      window.removeEventListener('ag-grid-edit', this.editHandler);
    }
  }
}

export default Hooks; 