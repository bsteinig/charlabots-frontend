import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

function Edit() {

    const router = useRouter();
    const { id: langId, botId } = router.query;

    useEffect(() => {
        console.log(langId, botId)
      }, [router.isReady]);

  return (
    <div>Edit  </div>
  )
}

export default Edit