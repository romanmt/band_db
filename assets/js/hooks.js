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

export default Hooks; 