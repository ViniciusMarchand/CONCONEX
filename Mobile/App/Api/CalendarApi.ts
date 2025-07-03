import { CalendarConfigurationDTO } from "../Components/Calendar/CalendarConfigs";
import { useGoogleAuth } from "../Contexts/GoogleAuthContext";
import { ClearGoogleAccessToken } from "../Utils/SecureStore";
import { Axios, AxiosGoogle } from "./Axios";

const APP_EVENT_UUID = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

interface EventDetails {
    dateTime: Date;
    userEmail: string;
    projectTitle: string,
    emailReceiver: string;
}

const controllerBase = 'api/calendar-configurations';

const CalendarApi = {

    createMeeting: async (eventDetails: EventDetails): Promise<any> => {
        const calendarId = 'primary';
        const URL = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1`;

        const { dateTime, userEmail, emailReceiver, projectTitle } = eventDetails;

        const startDateTime = new Date(dateTime.getTime() + 3 * 60 * 60 * 1000);
        const endDateTime = new Date(dateTime.getTime() + 4 * 60 * 60 * 1000);

        const event = {
            summary: `Reunião com ${emailReceiver}`,
            description: projectTitle,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: 'America/Sao_Paulo',
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: 'America/Sao_Paulo',
            },
            attendees: [
                { email: userEmail },
                { email: emailReceiver },
            ],
            extendedProperties: {
                private: {
                    appUuid: APP_EVENT_UUID,
                    scheduledBy: userEmail,
                },
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 30 },
                    { method: 'popup', minutes: 10 },
                ],
            },
            conferenceData: {
                createRequest: {
                    requestId: `${APP_EVENT_UUID}-${Date.now()}`,
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet',
                    },
                },
            },
        };

        try {
            const res = await AxiosGoogle.post(URL, event, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return res.data;
        } catch (error: any) {
            console.error("Erro ao criar reunião:", error.response ? error.response.data : error.message);

            if (error.code == 401) {
                ClearGoogleAccessToken();
            }
            throw error;
        }
    },

    listAppEvents: async (): Promise<any> => {
        const calendarId = 'primary';
        const URL = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const timeMin = today.toISOString();

        const filter = `privateExtendedProperty=appUuid=${APP_EVENT_UUID}`;

        try {
            const res = await AxiosGoogle.get(`${URL}?${filter}&timeMin=${timeMin}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return res.data.items;
        } catch (error: any) {
            console.error("Erro ao listar eventos do aplicativo:", error.response ? error.response.data : error.message);
            if (error.code == 401) {
                ClearGoogleAccessToken();
            }
            throw error;
        }
    },

    saveConfigs: async (form: CalendarConfigurationDTO) => {
        const URL = controllerBase + '/upsert';
        return await Axios.post(URL, form)
            .then((res) => res)
            .catch(error => {
                throw error;
            })
    },

    findByUserId: async (userId: string) => {
        const URL = controllerBase + `/user/${userId}`;
        return await Axios.get(URL)
            .then((res) => res.data)
            .catch(error => {
                throw error;
            })
    },

    cancelAppEvent: async (eventId: string): Promise<void> => {
        const calendarId = 'primary';
        const URL = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`;

        try {
            await AxiosGoogle.delete(URL);
            console.log(`Evento com ID ${eventId} cancelado com sucesso.`);
        } catch (error: any) {
            console.error(`Erro ao cancelar o evento com ID ${eventId}:`, error.response ? error.response.data : error.message);
            if (error.code == 401) {
                ClearGoogleAccessToken();
            }
            throw error;
        }
    },
};

export default CalendarApi;