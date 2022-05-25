
console.log('inside js');
class CustomSelect{
    constructor(originalSelect){
        this.originalSelect = originalSelect;
        this.customSelect = document.createElement('div');
        this.customSelect.classList.add('select');

        this.originalSelect.querySelectorAll('option').forEach(optionElement => {
            const itemElement = document.createElement('div');

            itemElement.classList.add('select_item');
            itemElement.textContent = optionElement.textContent;
            this.customSelect.appendChild(itemElement);

            itemElement.addEventListener('click', () => {
                if(itemElement.classList.contains('select_item_selected')){
                    this.deselect(itemElement);
                }else{
                    this.select(itemElement);
                }
            });
        });



        this.originalSelect.insertAdjacentElement("afterend", this.customSelect);
        this.originalSelect.style.display = "none";
    }

    select(itemElement){
        const index = Array.from(this.customSelect.children).indexOf(itemElement);
        this.originalSelect.querySelectorAll('option')[index].selected = true;
        itemElement.classList.add('select_item_selected');
    }

    deselect(itemElement){
        const index = Array.from(this.customSelect.children).indexOf(itemElement);
        this.originalSelect.querySelectorAll('option')[index].selected = false;
        itemElement.classList.remove('select_item_selected');
    }
}

document.querySelectorAll('.custom-select').forEach(selectElement => {
    new CustomSelect(selectElement);
});

