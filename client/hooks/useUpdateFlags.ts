import { useCallback, useState } from 'react';
import { COUNTRIES_LINK } from '../constants/common';
import { UserDto } from '../api/dtos/UserDto';

const useUpdateFlags = () => {
  const [flags, setFlags] = useState<Record<string, string>>({});

  const updateFlags = useCallback(async (players: UserDto[]) => {
    players.forEach((user) => {
      if (user?.country) {
        fetch(
          // eslint-disable-next-line max-len
          `${COUNTRIES_LINK}${user?.country}?fullText=true`
        )
          .then((res) => res.json())
          .then((countryEl) => {
            if (user?.country) {
              setFlags((prevFlags) => ({
                ...prevFlags,
                [user.country!]: countryEl[0].flags.png,
              }));
            }
          });
      }
    });
  }, []);

  return { flags, updateFlags };
};

export default useUpdateFlags;
