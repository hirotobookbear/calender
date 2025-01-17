"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable, DropArg } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { EventSourceInput } from '@fullcalendar/core/index.js'


interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
}

export default function Home() {

 const [allEvents, setAllEvents] = useState<Event[]>([])
 const [showModal, setShowModal] = useState(false)
 const [showDeleteModal, setShowDeleteModal] = useState(false)
 const [idToDelete, setIdToDelete] = useState<number | null>(null)
 const [newEvent, setNewEvent] = useState<Event>({
   title: '',
   start: '',
   allDay: false,
   id: 0
 })

 function handleDateClick(arg: { date: Date, allDay: boolean }) {
   setNewEvent({ ...newEvent, start: arg.date, allDay: arg.allDay, id: new Date().getTime() })
   setShowModal(true)
 }

 function addEvent(data: DropArg) {
   const event = { ...newEvent, start: data.date.toISOString(), title: data.draggedEl.innerText, allDay: data.allDay, id: new Date().getTime() }
   setAllEvents([...allEvents, event])
 }

 function handleDeleteModal(data: { event: { id: string } }) {
   setShowDeleteModal(true)
   setIdToDelete(Number(data.event.id))
 }

 function handleDelete() {
   setAllEvents(allEvents.filter(event => Number(event.id) !== Number(idToDelete)))
   setShowDeleteModal(false)
   setIdToDelete(null)
 }

 function handleCloseModal() {
   setShowModal(false)
   setNewEvent({
     title: '',
     start: '',
     allDay: false,
     id: 0
   })
   setShowDeleteModal(false)
   setIdToDelete(null)
 }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      title: e.target.value
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAllEvents([...allEvents, newEvent])
    setShowModal(false)
    setNewEvent({
      title: '',
      start: '',
      allDay: false,
      id: 0
    })
  }

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="grid grid-cols-10">
          <div className="col-span-8">
            <FullCalendar 
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin
              ]}
              headerToolbar={{
                left: 'prev next',
                center: 'title',
                right: 'dayGridMonth timeGridWeek'
              }}
              locale="ja"
              buttonText={{
      	      month:'今月',
      	      week:'今週',
  	      }}
             events={allEvents as EventSourceInput}
             nowIndicator={true}
             editable={true}
             droppable={true}
             selectable={true}
             selectMirror={true}
             dateClick={handleDateClick}
             drop={(data) => addEvent(data)}
             eventClick={(data) => handleDeleteModal(data)}
            />
          </div>
        </div>
       <Transition.Root show={showModal} as={Fragment}>
         <Dialog as="div" className="relative z-10" onClose={setShowModal}>
           <Transition.Child
             as={Fragment}
             enter="ease-out duration-300"
             enterFrom="opacity-0"
             enterTo="opacity-100"
             leave="ease-in duration-200"
             leaveFrom="opacity-100"
             leaveTo="opacity-0"
           >
             <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
           </Transition.Child>

           <div className="fixed inset-0 z-10 overflow-y-auto">
             <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
               <Transition.Child
                 as={Fragment}
                 enter="ease-out duration-300"
                 enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                 enterTo="opacity-100 translate-y-0 sm:scale-100"
                 leave="ease-in duration-200"
                 leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                 leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
               >
                 <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                   <div>
                     <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                       <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                     </div>
                     <div className="mt-3 text-center sm:mt-5">
                       <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                         イベント追加
                       </Dialog.Title>
                       <form action="submit" onSubmit={handleSubmit}>
                         <div className="mt-2">
                           <input type="text" name="title" className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                           shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                           focus:ring-2 
                           focus:ring-inset focus:ring-violet-600 
                           sm:text-sm sm:leading-6"
                             value={newEvent.title} onChange={(e) => handleChange(e)} placeholder="タイトル" />
                         </div>
                         <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                           <button
                             type="submit"
                             className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25"
                             disabled={newEvent.title === ''}
                           >
                             作成
                           </button>
                           <button
                             type="button"
                             className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                             onClick={handleCloseModal}

                           >
                             キャンセル
                           </button>
                         </div>
                       </form>
                     </div>
                   </div>
                 </Dialog.Panel>
               </Transition.Child>
             </div>
           </div>
         </Dialog>
       </Transition.Root>
      </main>
    </>
  );
}
   