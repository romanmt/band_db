let Hooks = {}

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

export default Hooks; 