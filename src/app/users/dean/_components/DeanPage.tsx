'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HAVisitsTab from './HATab';
import RoleControlTab from './RoleTab';
import MentallyChallengedTab from './MentallyChallengingTab';

// Import the components for each tab
// import HAVisitsTab from './dean-tabs/HAVisitsTab';
// import RoleControlTab from './dean-tabs/RoleControlTab';
// import MentallyChallengedTab from './dean-tabs/MentallyChallengedTab';

const DeanPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Dean Dashboard</h1>

      <Tabs defaultValue="ha-visits" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ha-visits">HA Visits</TabsTrigger>
          <TabsTrigger value="role-control">Role Control</TabsTrigger>
          <TabsTrigger value="mentally-challenged">Mentally Challenged Issues</TabsTrigger>
        </TabsList>
        <TabsContent value="ha-visits">
          <Card>
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
              <HAVisitsTab />

            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="role-control">
          <Card>
            <CardHeader>
              <CardTitle>User Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <RoleControlTab />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mentally-challenged">
          <Card>
            <CardHeader>
              <CardTitle>Mentally Challenged Issues Management</CardTitle>
            </CardHeader>
            <CardContent>
              <MentallyChallengedTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeanPage;