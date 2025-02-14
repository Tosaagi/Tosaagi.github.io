import re
import sys
from datetime import datetime
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QHBoxLayout, QListWidget, QPushButton, QLineEdit, QMessageBox, QListWidgetItem
from PyQt5.QtGui import QKeyEvent
from PyQt5.QtCore import Qt

class ToDoList(QWidget):
    def __init__(self):
        super().__init__()

        # Window Properties
        self.setWindowTitle("To-Do List")
        self.setGeometry(100, 100, 500, 400)

        # Main Layout
        self.layout = QVBoxLayout()

        # Task Input
        self.task_input = QLineEdit(self)
        self.task_input.setPlaceholderText("Enter a new task...")
        self.layout.addWidget(self.task_input)
        self.task_input.setFocus()

        self.task_due_input = QLineEdit(self)
        self.task_due_input.setPlaceholderText("Enter due date...")
        self.layout.addWidget(self.task_due_input)

        # Listbox
        hbox = QHBoxLayout()
        self.task_list = QListWidget()
        self.task_due_list = QListWidget()

        # Sync scrolling
        self.task_list.verticalScrollBar().valueChanged.connect(self.task_due_list.verticalScrollBar().setValue)
        self.task_due_list.verticalScrollBar().valueChanged.connect(self.task_list.verticalScrollBar().setValue)

        hbox.addWidget(self.task_list)
        hbox.addWidget(self.task_due_list)

        hbox.setStretchFactor(self.task_list, 5)
        hbox.setStretchFactor(self.task_due_list, 1)

        self.layout.addLayout(hbox)

        # Buttons
        self.add_button = QPushButton("Add Task", self)
        self.add_button.clicked.connect(self.add_task)
        self.layout.addWidget(self.add_button)

        self.remove_button = QPushButton("Remove Task", self)
        self.remove_button.clicked.connect(self.remove_task)
        self.layout.addWidget(self.remove_button)

        # Set the main layout
        self.setLayout(self.layout)

        # Track added month-year combinations
        self.existing_months = set()

    def keyPressEvent(self, event: QKeyEvent):
        if event.key() == Qt.Key_Return or event.key() == Qt.Key_Enter:
            if self.task_input.hasFocus():
                self.task_due_input.setFocus()
            elif self.task_due_input.hasFocus():
                self.add_task()
                self.task_input.setFocus()
        elif event.key() == Qt.Key_Tab:  # Move focus forward with Tab
            self.focusNextChild()
        elif event.key() == Qt.Key_Backtab:  # Move focus backward with Shift+Tab
            self.focusPreviousChild()
        elif event.key() == Qt.Key_Down and self.task_list.count() > 0:  # Move to the next widget (optional)
            if self.task_list.hasFocus():
                self.focusNextChild()
            else:
                self.task_list.setCurrentItem(self.task_list.item(1))
                self.task_list.setFocus()
        elif event.key() == Qt.Key_Up and self.task_list.count() > 0:  # Move to the previous widget (optional)
            if self.task_list.hasFocus():
                self.focusPreviousChild()
            else:
                self.task_list.setCurrentItem(self.task_list.item(self.task_list.count() - 1))
                self.task_list.setFocus()
        else:
            super().keyPressEvent(event)  # Default behavior for other keys

    def add_task(self):
        task = self.task_input.text().strip().replace("\n", " ").replace("\r", " ")
        due_date = self.task_due_input.text().strip().replace("\n", " ").replace("\r", " ")

        date_pattern = r"^\d{6}$"  # 6 digits

        if not task:
            QMessageBox.warning(self, "Input Error", "Task name cannot be empty.", QMessageBox.Ok)
            return

        if not re.match(date_pattern, due_date):
            QMessageBox.warning(self, "Input Error", "Due date must be in ddmmyy format (e.g., 150224 for 15 Feb 2024).", QMessageBox.Ok)
            return

        day = int(due_date[:2])
        month = int(due_date[2:4])
        year = int(due_date[4:]) + 2000 

        try:
            datetime(year, month, day)  
        except ValueError:
            QMessageBox.warning(self, "Input Error", f"Invalid due date: {due_date}. Please enter a valid date.", QMessageBox.Ok)
            return

        # Datetime object
        date_obj = datetime(year, month, day)
        short_day = date_obj.strftime("%a")
        full_month = date_obj.strftime("%B")
        short_month = date_obj.strftime("%b")
        month_year = f"{full_month} {year}"
        month_year_short = f"{short_month} {year}"

        # Sortable date format
        sortable_date = f"{year:04}{month:02}{day:02}"

        insert_position = 0
        for i in range(self.task_due_list.count()):
            # For task_due_list header
            if self.task_due_list.item(i).text()[3] == " ":
                existing_date = self.task_due_list.item(i).text()
                existing_month = int(datetime.strptime(existing_date[:3], "%b").month)
                existing_year = int(existing_date[-4:])
                existing_sortable_date = f"{existing_year:04}{existing_month:02}"

                if sortable_date > existing_sortable_date: # 0119 < 0219
                    insert_position += 1
                    
                continue

            # For task_due_list
            existing_date = self.task_due_list.item(i).text()
            existing_day = int(existing_date[5:7])
            existing_month = int(existing_date[7:9])
            existing_year = int(existing_date[9:11]) + 2000
            existing_sortable_date = f"{existing_year:04}{existing_month:02}{existing_day:02}"

            if sortable_date <= existing_sortable_date:
                break
            insert_position += 1

        # Insert month-year header if not already present
        if month_year not in self.existing_months:
            self.existing_months.add(month_year)
            divider = QListWidgetItem(month_year)
            divider.setFlags(Qt.ItemIsEnabled)  # Make it non-editable
            divider.setTextAlignment(Qt.AlignCenter)  # Center text
            divider_month_year = QListWidgetItem(month_year_short)
            divider_month_year.setFlags(Qt.ItemIsEnabled)
            divider_month_year.setTextAlignment(Qt.AlignCenter)
            self.task_list.insertItem(insert_position, divider)
            self.task_due_list.insertItem(insert_position, divider_month_year)
            insert_position += 1  # Adjust position for actual task

        # Insert task and due date
        self.task_list.insertItem(insert_position, task)

        due_date_text = QListWidgetItem(f"{short_day}, {due_date}")
        due_date_text.setFlags(Qt.ItemIsEnabled)
        self.task_due_list.insertItem(insert_position, due_date_text)

        self.task_input.clear()
        self.task_due_input.clear()

    def remove_task(self):
        selected_task = self.task_list.currentRow()

        if selected_task >= 0:
            task_text = self.task_list.item(selected_task).text()

            if task_text in self.existing_months:
                return

            # Remove task
            self.task_list.takeItem(selected_task)
            self.task_due_list.takeItem(selected_task)

            # If the removed task was the last one under a month-year header, remove the header too
            if selected_task > 0:  # Check previous item
                prev_item = self.task_list.item(selected_task - 1)
                if prev_item and prev_item.text() in self.existing_months:
                    next_item = self.task_list.item(selected_task)
                    if not next_item or next_item.text() in self.existing_months:
                        self.task_list.takeItem(selected_task - 1)
                        self.task_due_list.takeItem(selected_task - 1)
                        self.existing_months.remove(prev_item.text())
        else:
            QMessageBox.warning(self, "Selection Error", "Please select a task to remove.")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = ToDoList()
    window.show()
    sys.exit(app.exec_())
