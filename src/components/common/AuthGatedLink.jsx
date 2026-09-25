'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useUserAuth } from '@/hooks/useUserAuth'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import LoginForm from '@/components/login/LoginForm'

/**
 * Next.js Link that can gate navigation behind login.
 * By default it blocks navigation and opens the login modal when the user
 * isn't authenticated. Pass `guard` to customize/extend that check (e.g. to
 * also block a host from booking their own wedding) - return `null` to allow
 * navigation, or an object describing the modal to show instead.
 */
export default function AuthGatedLink({ href, className = '', children, guard, ...rest }) {
  const auth = useUserAuth()
  const { isOpen, openModal, closeModal } = useModal()
  const [modalState, setModalState] = useState({ title: '', description: '', showLoginForm: true })

  const handleClick = (event) => {
    const result = guard
      ? guard(auth)
      : auth.isAuthenticated
        ? null
        : { title: '', description: '', showLoginForm: true }

    if (result) {
      event.preventDefault()
      setModalState({
        title: result.title ?? '',
        description: result.description ?? '',
        showLoginForm: result.showLoginForm ?? false,
      })
      openModal()
    }
  }

  return (
    <>
      <Link href={href} onClick={handleClick} className={className} {...rest}>
        {children}
      </Link>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size={modalState.showLoginForm ? '3xl' : 'sm'}
        noPadding
        title={modalState.title}
        description={modalState.description}
      >
        {modalState.showLoginForm && <LoginForm onClose={closeModal} />}
      </Modal>
    </>
  )
}
