import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { UploadPhotoForm } from "./_components/upload-photo";
import PersonalInfoForm from "./_components/personal-info";


interface PersonalInfoFormProps {
  user: any;
  refetch:() => void
}

export default function ProfilePage( { user, refetch }: PersonalInfoFormProps) {
  return (
    <div className="mx-auto w-full max-w-[1080px] overflow-hidden">
      <Breadcrumb pageName="Profile" />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <PersonalInfoForm user={user} refetch={refetch} />
        </div>
        <div className="col-span-5 xl:col-span-2">
          <UploadPhotoForm user={user} refetch={refetch} />
        </div>
      </div>
    </div>
  );
};

