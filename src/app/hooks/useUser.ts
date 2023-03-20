import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../config/store'
import { getUser, clearUser } from '../config/reducers/usersSlice'
import { useEffect } from 'react'


/**
 * @returns {Object} user
 * @description Hook to handle user session
 */
export const useUser = () => {
  const dispatch = useDispatch()

  /**
   * @returns {Object} user
   * @description Get user from session storage
   */

  const user = useSelector((state: RootState) => state.user.user)

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  /**
   * @returns {void}
   * @description Clear user from session storage and set user to null
   */
  const destroy = () => {
    dispatch(clearUser())
  }

  return { 
    user,
    destroy
  }
}
