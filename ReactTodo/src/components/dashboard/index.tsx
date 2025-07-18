
import Lucy from '../../assets/images/lucy.svg';
import Party from '../../assets/images/party.svg';
import { ProgressChart } from '../progress/chart';
import Modal from '../ui/modal';
import { useState } from 'react';
import TaskCard from '../ui/card';
import GridContainer from '../ui/gridcontainer';

function Home() {

    const [isOpenModal, setIsOpenModal] = useState(false);


    return (
        <>


            {/* main Container */}
            <div className="flex-1">

                {/* Top Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center font-poppins px-2 space-y-4 md:space-y-0">
                    <h1 className='text-2xl md:text-4xl text-gray-900 font-bold'>Welcome Back Nitin Sharma👋</h1>
                    <div className="flex items-center space-x-4 md:space-x-10">
                        <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <a key={i} href="#" className="decoration-none w-8 h-8 md:w-10 md:h-10 rounded-xl border border-white">
                                    <img src={Lucy} className="w-full" />
                                </a>
                            ))}
                        </div>
                        <button onClick={() => setIsOpenModal(true)} className='bg-red-100 text-red-500 px-2 py-1 md:px-4 md:py-2 border border-red-200 rounded-lg flex items-center space-x-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus-icon lucide-user-plus w-5 h-5 md:w-6 md:h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                            <span className='text-xs md:text-sm'>Invite</span>
                        </button>
                        {isOpenModal && (
                            <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} title="Send an Invite to a New Member">
                                <div className="space-y-4">
                                    <h3 className="text-xl">Email</h3>
                                    <div className="flex items-center md:space-x-4 justify-start flex md:flex-row flex-col  items-center space-x-4">
                                        <input type="text" placeholder="Enter email address" className="w-full p-2 border border-gray-300 rounded-lg" />
                                        <button className="bg-red-500 text-white px-4 py-2 w-max rounded text-nowrap" >Send Invite</button>
                                    </div>
                                    <h3 className="text-xl">Members</h3>
                                    <ul className="space-y-4">
                                        <li>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-5">
                                                    <img className="w-full w-10 h-10 border border-red-500 rounded-full" src="/src/assets/images/lucy.svg" />
                                                    <div className="flex flex-col">
                                                        <h3>Upasna Gurung</h3>
                                                        <p>upasna@gmai.com</p>
                                                    </div>
                                                </div>
                                                <select id="permissions" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-600 block w-max p-2.5 dark:bg-red-500 dark:border-red-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500">
                                                    <option value="can-edit" selected>can edit</option>
                                                    <option value="can-delete">can delete</option>
                                                </select>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-5">
                                                    <img className="w-full w-10 h-10 border border-red-500 rounded-full" src="/src/assets/images/lucy.svg" />
                                                    <div className="flex flex-col">
                                                        <h3>Yash Ghai</h3>
                                                        <p>yash@gmai.com</p>
                                                    </div>
                                                </div>
                                                <select id="permissions" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-600 block w-max p-2.5 dark:bg-red-500 dark:border-red-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500">
                                                    <option value="can-edit" selected>can edit</option>
                                                    <option value="can-delete">can delete</option>
                                                </select>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-5">
                                                    <img className="w-full w-10 h-10 border border-red-500 rounded-full" src="/src/assets/images/lucy.svg" />
                                                    <div className="flex flex-col">
                                                        <h3>Shubham Goyal</h3>
                                                        <p>shubham@gmail.com</p>
                                                    </div>
                                                </div>
                                                <select id="permissions" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-600 block w-max p-2.5 dark:bg-red-500 dark:border-red-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500">
                                                    <option value="can-edit" selected>can edit</option>
                                                    <option value="can-delete">can delete</option>
                                                </select>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-5">
                                                    <img className="w-full w-10 h-10 border border-red-500 rounded-full" src="/src/assets/images/lucy.svg" />
                                                    <div className="flex flex-col">
                                                        <h3>Upasna Gurung</h3>
                                                        <p>upasna@gmai.com</p>
                                                    </div>
                                                </div>
                                                <select id="permissions" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-600 block w-max p-2.5 dark:bg-red-500 dark:border-red-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500">
                                                    <option value="can-edit" selected>can edit</option>
                                                    <option value="can-delete">can delete</option>
                                                </select>
                                            </div>
                                        </li>
                                    </ul>


                                </div>
                            </Modal>
                        )
                        }
                    </div>
                </div>


                {/* Data Section */}
                <GridContainer className="md:mt-10 border border-gray-300 md:p-6 shadow-lg">
                    <div className="bg-white md:p-4 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4 font-demi">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-clock-icon lucide-calendar-clock text-red-500"><path d="M16 14v2.2l1.6 1" /><path d="M16 2v4" /><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><path d="M3 10h5" /><path d="M8 2v4" /><circle cx="16" cy="16" r="6" /></svg>
                                </div>
                                <span className="text-red-500">To-Do</span>
                            </div>
                            <button className="bg-gray-50 px-4 py-2 border border-none rounded-lg flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus text-red-500"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                <span className="text-sm text-gray-500">Add Task</span>
                            </button>
                        </div>
                        <div className="text-sm text-gray-700 mb-4 font-demi">
                            20 June &nbsp;
                            <span className='text-gray-500'>.Today</span>
                        </div>
                        <div className="space-y-4">
                            <TaskCard
                                title="Attend Michal's Birthday Party"
                                description="Buy gift on the way and pick up cake form the backery. (6 PM | Fresh Elements)..."
                                status="Not Started"
                                statusColor="red"
                                priority="Moderate"
                                priorityColor="blue"
                                date="20/06/2025"
                                image={Party}
                                circleColor="red">
                            </TaskCard>
                            <TaskCard
                                title="Attend Michal's Birthday Party"
                                description="Buy gift on the way and pick up cake form the backery. (6 PM | Fresh Elements)..."
                                status="Not Started"
                                statusColor="red"
                                priority="Moderate"
                                priorityColor="blue"
                                date="20/06/2025"
                                image={Party}
                                circleColor="red">
                            </TaskCard>
                            <TaskCard
                                title="Attend Michal's Birthday Party"
                                description="Buy gift on the way and pick up cake form the backery. (6 PM | Fresh Elements)..."
                                status="Not Started"
                                statusColor="red"
                                priority="Moderate"
                                priorityColor="blue"
                                date="20/06/2025"
                                image={Party}
                                circleColor="red">
                            </TaskCard>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-4 font-demi">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check2-icon lucide-calendar-check-2 text-red-500"><path d="M8 2v4" /><path d="M16 2v4" /><path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" /><path d="M3 10h18" /><path d="m16 20 2 2 4-4" /></svg>
                                    </div>
                                    <span className="text-red-500">Task Progress</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex justify-between items-center">
                                    <ProgressChart label="Completed" percentage={72} colorCode="#05A301" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <ProgressChart label="In Progress" percentage={45} colorCode="#0225FF" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <ProgressChart label="Not Started" percentage={15} colorCode="#F21E1E" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            {/* Start */}
                            <div className="flex justify-between items-center mb-4 font-demi">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check-icon lucide-clipboard-check text-red-500"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>
                                    </div>
                                    <span className="text-red-500">Completed Tasks</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-lg py-5 px-4 relative font-poppins">
                                    <div className="flex items-center justify-between">
                                        {/* Circle */}
                                        <div className="w-5 h-5 border-2 border-green-500 rounded-full mt-1 flex-shrink-0 absolute left-5 top-4"></div>
                                        <div className="w-5 h-5 text-gray-500 absolute right-5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-icon lucide-ellipsis"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg></div>
                                    </div>
                                    <div className="flex items-center space-x-4 px-8">
                                        <div className="flex-1">
                                            <h2 className='text-gray-700 mb-3 font-bold'>Attend Michal's Birthday Party</h2>
                                            <p className='text-gray-500 text-sm'>Buy gift on the way and pick up cake form the backery. (6 PM | Fresh Elements)...</p>
                                        </div>
                                        <div className="w-22 h-22 rounded-lg mt-2">
                                            <img src={Party} className="w-full" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between space-y-3 mt-3 px-8">
                                        <p className='text-xs text-gray-500'>Status: <span className='text-green-400'>Completed</span></p>
                                        <p className='text-xs text-gray-500'>Completed: <span className='text-gray-400'>2 Days Ago</span></p>
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-lg py-5 px-4 relative font-poppins">
                                    <div className="flex items-center justify-between">
                                        {/* Circle */}
                                        <div className="w-5 h-5 border-2 border-green-500 rounded-full mt-1 flex-shrink-0 absolute left-5 top-4"></div>
                                        <div className="w-5 h-5 text-gray-500 absolute right-5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-icon lucide-ellipsis"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg></div>
                                    </div>
                                    <div className="flex items-center space-x-4 px-8">
                                        <div className="flex-1">
                                            <h2 className='text-gray-700 mb-3 font-bold'>Attend Michal's Birthday Party</h2>
                                            <p className='text-gray-500 text-sm'>Buy gift on the way and pick up cake form the backery. (6 PM | Fresh Elements)...</p>
                                        </div>
                                        <div className="w-22 h-22 rounded-lg mt-2">
                                            <img src={Party} className="w-full" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between space-y-3 mt-3 px-8">
                                        <p className='text-xs text-gray-500'>Status: <span className='text-green-400'>Completed</span></p>
                                        <p className='text-xs text-gray-500'>Completed: <span className='text-gray-400'>2 Days Ago</span></p>
                                    </div>
                                </div>
                            </div>
                            {/* End */}
                        </div>
                    </div>
                </GridContainer>

            </div>
        </>

    )
}

export default Home;