import { FakeUploader } from '../_tests/storage/fake-uploader'
import { InMemoryAttachmentsRepository } from '../_tests/repositores/in-memory-attachments.repository'

import { InvalidAttachmentTypeError } from './errors/InvalidAttachmentType.error'

import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachments'

let attachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader

let sut: UploadAndCreateAttachmentUseCase

describe('Upload And Create Attachment Use Case', () => {
  fakeUploader = new FakeUploader()
  attachmentsRepository = new InMemoryAttachmentsRepository()

  sut = new UploadAndCreateAttachmentUseCase(
    attachmentsRepository,
    fakeUploader,
  )

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: attachmentsRepository.items[0],
    })

    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toMatchObject({
      fileName: 'profile.png',
    })
  })

  it('should not be able to upload an invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
