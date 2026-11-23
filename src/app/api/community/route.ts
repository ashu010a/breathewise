import { NextResponse } from 'next/server';
import { CommunityChallenge } from '@/lib/types';

const INITIAL_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'chal-transit-3',
    title: 'Clean Transit Triplet',
    description: 'Replace at least 3 single-occupancy vehicle trips with Metro, Electric Bus, or walking when AQI permits.',
    category: 'Commute',
    targetGoal: '3 trips this week',
    participantsCount: 412,
    startDate: '2026-11-20',
    endDate: '2026-11-27',
    progressPercent: 68,
    estimatedCo2SavedKg: 1240,
    isUserJoined: true,
  },
  {
    id: 'chal-zero-waste-burn',
    title: 'Zero Open Burning Neighborhood Watch',
    description: 'Ensure dry garden foliage and domestic packaging waste is segregated and composted rather than burned.',
    category: 'Clean Air',
    targetGoal: '100% compliant sector',
    participantsCount: 890,
    startDate: '2026-11-15',
    endDate: '2026-11-30',
    progressPercent: 92,
    estimatedCo2SavedKg: 2850,
    isUserJoined: true,
  },
  {
    id: 'chal-hepa-care',
    title: 'Clean Sanctuary & Filter Maintenance Drive',
    description: 'Vacuum air purifier pre-filters and inspect door seals across apartments to minimize indoor smog ingress.',
    category: 'Indoor Safety',
    targetGoal: '500 households verified',
    participantsCount: 348,
    startDate: '2026-11-22',
    endDate: '2026-11-29',
    progressPercent: 54,
    estimatedCo2SavedKg: 0,
    isUserJoined: false,
  },
  {
    id: 'chal-wfh-solidarity',
    title: 'Winter Smog WFH Day',
    description: 'Coordinate remote work on peak smog alert days (Thursdays/Fridays) to flatten vehicular peak rush emissions.',
    category: 'Workplace',
    targetGoal: '2 days avoided commute',
    participantsCount: 625,
    startDate: '2026-11-21',
    endDate: '2026-11-28',
    progressPercent: 74,
    estimatedCo2SavedKg: 3100,
    isUserJoined: true,
  },
];

export async function GET() {
  return NextResponse.json({
    challenges: INITIAL_CHALLENGES,
    neighborhoodStats: {
      sectorName: 'Delhi-NCR South / Lodhi Zone',
      participatingHouseholds: 1840,
      totalCo2eAvoidedKg: 14680,
      openFiresReportedAndDoused: 14,
      airPurifierSanctuariesActive: 1280,
      averageIndoorPm25ReductionPercent: 64,
    },
    localInitiatives: [
      {
        title: 'Municipal Smog Gun & Anti-Dust Water Sprinkling',
        location: 'Ring Road & Ring Road Flyover corridors',
        schedule: 'Daily 05:00 AM - 08:00 AM & 08:00 PM - 11:00 PM',
        status: 'Active',
      },
      {
        title: 'Citizen Air Quality Sensor Network Deployment',
        location: 'Community Center Sector 14',
        schedule: 'Upcoming Sunday 10:00 AM',
        status: 'Open for Volunteers',
      },
      {
        title: 'N95 Respirator Distribution for Sanitation & Outdoor Workers',
        location: 'Metro Gate 2 & Primary Health Dispensary',
        schedule: 'Mon - Fri ongoing',
        status: 'Sponsored Initiative',
      },
    ],
  });
}
