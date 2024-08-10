import React, { Component } from 'react';
import moment from 'moment-timezone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TimeZoneDisplay from './TimeZoneDisplay'; 
import AddTimeZone from './AddTimeZone'; 
import 'react-datepicker/dist/react-datepicker.css'; 
import DatePicker from 'react-datepicker'; 
import './style.css';

class TimeZoneConverter extends Component {
  constructor(props) {
    super(props);
    const initialUtcTime = moment().hour(0).minute(0).second(0).utc();
    this.state = {
      timeZones: ['UTC', 'Asia/Kolkata'], 
      currentTime: initialUtcTime, 
      selectedDate: new Date(), 
      utcTime: initialUtcTime, 
      istTime: initialUtcTime.clone().tz('Asia/Kolkata'),
      isDarkMode: false 
    };
  }

  handleTimeZoneAddition = (timeZone) => {
    this.setState(prevState => ({
      timeZones: [...prevState.timeZones, timeZone]
    }));
  };

  handleTimeZoneDeletion = (index) => {
    this.setState(prevState => ({
      timeZones: prevState.timeZones.filter((_, i) => i !== index)
    }));
  };

  onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(this.state.timeZones);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    this.setState({ timeZones: items });
  };

  handleSliderChange = (e) => {
    const utcHour = parseInt(e.target.value, 10);
    const utcTime = moment().hour(utcHour).minute(0).second(0).utc();
    const istTime = utcTime.clone().tz('Asia/Kolkata');

    this.setState({
      utcTime,
      currentTime: utcTime,
      istTime
    });
  };

  handleDateChange = (date) => {
    const utcTime = moment(date).utc().startOf('day');
    const istTime = utcTime.clone().tz('Asia/Kolkata');

    this.setState({
      selectedDate: date,
      currentTime: utcTime,
      utcTime,
      istTime
    });
  };

  toggleDarkMode = () => {
    this.setState(prevState => ({
      isDarkMode: !prevState.isDarkMode
    }));
  };

  render() {
    const { timeZones, utcTime, istTime, selectedDate, isDarkMode } = this.state;

    const timeLabels = Array.from({ length: 24 }, (_, hour) => (
      <div key={hour} className="time-label" style={{ left: `${(hour / 23) * 100}%` }}>
        {moment().hour(hour).format('hA')}
      </div>
    ));

    return (
      <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
        <nav className="navbar">
          <AddTimeZone onAdd={this.handleTimeZoneAddition} />
          <DatePicker
            selected={selectedDate}
            onChange={this.handleDateChange}
            dateFormat="yyyy/MM/dd"
          />
          <button onClick={this.toggleDarkMode}>
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
        </nav>
        <div className="time-display">
          <h1>
            UTC Time: {utcTime.format('YYYY-MM-DD HH:mm:ss')}  
          </h1>
          <h1>
            IST Time: {istTime.format('YYYY-MM-DD HH:mm:ss')}
          </h1>
        </div>
        <div className="slider-container">
          <label className='utcTime'>UTC Time: {utcTime.format('YYYY-MM-DD HH:mm:ss')}</label>
          <input
            type="range"
            min="0"
            max="23"
            value={utcTime.hour()}
            onChange={this.handleSliderChange}
            className='utcInput'
          />
          <div className='timelabels'>
            {timeLabels}
          </div>
        </div>
        <div className="slider-container">
          <label className='istTime'>IST Time: {istTime.format('YYYY-MM-DD HH:mm:ss')}</label>
          <input
            type="range"
            min="0"
            max="23"
            value={istTime.hour()}
            disabled
            className='istInput'
          />
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {timeZones.map((zone, index) => (
                  <Draggable key={zone} draggableId={zone} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TimeZoneDisplay
                          timeZone={zone}
                          currentTime={zone === 'Asia/Kolkata' ? istTime : utcTime}
                          onDelete={() => this.handleTimeZoneDeletion(index)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

export default TimeZoneConverter;
